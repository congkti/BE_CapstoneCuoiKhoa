import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Request } from 'express';
import * as path from 'node:path';
import { NO_FILE_IN_REQ } from 'src/common/constant/global.constant';
import { cleanString } from 'src/common/utils/handle-string.util';
import deleteUploadedFile from 'src/common/multers/delete-uploaded-file.multer';

@Injectable()
export class LocationsService {
  constructor(
    public prisma: PrismaService,
    // public configService: ConfigService,
  ) {}

  async createLocation(
    req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException(NO_FILE_IN_REQ);
    const arrPath = file.path?.split(path.sep);
    const imgUrl = arrPath?.join('/');

    const { locationName, locationCity, locationNational } = req.body;
    if (!locationName) {
      // delete newly uploaded image file
      deleteUploadedFile(imgUrl);
      throw new BadRequestException('Location Name is required');
    }

    try {
      const newLocation = await this.prisma.home_location.create({
        data: {
          loc_name: cleanString(locationName),
          loc_city: cleanString(locationCity) || null,
          loc_national: cleanString(locationNational) || null,
          loc_pic_url: imgUrl,
        },
        omit: {
          created_at: true,
          updated_at: true,
        },
      });
      return newLocation;
    } catch (err) {
      // if error => delete newly uploaded image file
      deleteUploadedFile(imgUrl);
      console.log(err);
      throw new InternalServerErrorException(
        'An error occurred while creating new Location',
      );
    }
  }

  async findAllLocations() {
    const locations = await this.prisma.home_location.findMany({
      omit: {
        created_at: true,
        updated_at: true,
      },
    });
    return locations;
  }

  async updateLocation(
    lid: number,
    req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException(NO_FILE_IN_REQ);
    const arrPath = file.path?.split(path.sep);
    const imgUrl = arrPath?.join('/');

    const isLocationExist = await this.prisma.home_location.findFirst({
      where: {
        loc_id: lid,
      },
    });

    if (!isLocationExist) {
      // delete newly uploaded image file
      deleteUploadedFile(imgUrl);
      throw new NotFoundException(`Location  with id#${lid} not found`);
    }

    const { locationName, locationCity, locationNational } = req.body;
    if (!locationName) {
      // delete newly uploaded image file
      deleteUploadedFile(imgUrl);
      throw new BadRequestException('Location Name is required');
    }

    // delete old image of Location before updating
    deleteUploadedFile(isLocationExist.loc_pic_url);

    try {
      const locationUpdate = await this.prisma.home_location.update({
        where: {
          loc_id: lid,
        },
        data: {
          loc_name: cleanString(locationName),
          loc_city: cleanString(locationCity) || null,
          loc_national: cleanString(locationNational) || null,
          loc_pic_url: imgUrl,
        },
        omit: {
          created_at: true,
          updated_at: true,
        },
      });

      return locationUpdate;
    } catch (err) {
      // if error => delete newly uploaded image file
      deleteUploadedFile(imgUrl);
      console.log(err);
      throw new InternalServerErrorException(
        'An error occurred while updating Location',
      );
    }
  }

  async removeLocation(lid: number) {
    console.log(Boolean(lid));
    const isLocationExist = await this.prisma.home_location.findFirst({
      where: {
        loc_id: lid,
      },
    });
    if (!isLocationExist)
      throw new NotFoundException('Location does not exist');

    // delete images of this location before
    deleteUploadedFile(isLocationExist.loc_pic_url);
    try {
      await this.prisma.home_location.delete({
        where: {
          loc_id: lid,
        },
      });

      return {
        deletedLocationId: isLocationExist.loc_id,
        deletedLocationName: isLocationExist.loc_name,
        deletedDate: new Date(),
      };
    } catch (err) {
      console.log('ERROR WHEN DELETING LOCATION: ', err);
    }
  }

  async getDeatailLocation(lid: number) {
    const location = await this.prisma.home_location.findFirst({
      where: {
        loc_id: lid,
      },
      omit: {
        created_at: true,
        updated_at: true,
      },
    });

    if (!location)
      throw new NotFoundException(`Location  with id#${lid} not found`);

    return location;
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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

  async createLocationLocal(
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

  async findAllLoactions() {
    const locations = await this.prisma.home_location.findMany({
      omit: {
        created_at: true,
        updated_at: true,
      },
    });
    return locations;
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import { Request } from 'express';
import * as path from 'node:path';
import { NO_FILE_IN_REQ } from 'src/common/constant/global.constant';
import deleteUploadedFile from 'src/common/multers/delete-uploaded-file.multer';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { cleanString } from 'src/common/utils/handle-string.util';

@Injectable()
export class HomesService {
  constructor(
    public prisma: PrismaService,
    // public configService: ConfigService,
  ) {}

  async getListAllHomes() {
    const homes = await this.prisma.homes.findMany({
      select: {
        home_id: true,
        home_name: true,
        rental_home_types: {
          select: {
            type_id: true,
            type_name: true,
          },
        },
        home_location: {
          select: {
            loc_id: true,
            loc_name: true,
            loc_city: true,
            loc_national: true,
            loc_pic_url: true,
          },
        },
        home_description: true,
        home_price: true,
        pic_url: true,
        amount_guests: true,
        amount_bedrooms: true,
        amount_beds: true,
        amount_baths: true,
        gmap_address: true,
      },
    });

    return homes;
  }

  async getDetailHomeById(hid: number) {
    const home = await this.prisma.homes.findFirst({
      where: {
        home_id: hid,
      },
      select: {
        home_id: true,
        home_name: true,
        rental_home_types: {
          select: {
            type_id: true,
            type_name: true,
          },
        },
        home_location: {
          select: {
            loc_id: true,
            loc_name: true,
            loc_city: true,
            loc_national: true,
            loc_pic_url: true,
          },
        },
        home_description: true,
        home_price: true,
        pic_url: true,
        amount_guests: true,
        amount_bedrooms: true,
        amount_beds: true,
        amount_baths: true,
        gmap_address: true,
        has_hair_dryer: true,
        has_washer: true,
        has_clothes_dryer: true,
        has_iron: true,
        has_tivi: true,
        has_air_cond: true,
        has_wifi: true,
        has_kitchen: true,
        has_parking: true,
        has_pool: true,
        has_fireplace: true,
      },
    });

    if (!home) throw new NotFoundException(`Home  with id#${hid} not found`);

    return home;
  }

  async updateHome(
    hid: number,
    req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // console.log(hid, req.body);
    // console.log({ file });
    if (!file) throw new BadRequestException(NO_FILE_IN_REQ);
    const arrPath = file.path?.split(path.sep);
    const imgUrl = arrPath?.join('/');

    const isHomeExist = await this.prisma.homes.findFirst({
      where: {
        home_id: hid,
      },
    });

    if (!isHomeExist) {
      // delete newly uploaded image file
      deleteUploadedFile(imgUrl);
      throw new NotFoundException(`Home  with id#${hid} not found`);
    }

    const {
      homeName,
      typeId,
      locId,
      homeDescription,
      homePrice,
      amountGuests,
      amountBedrooms,
      amountBeds,
      amountBaths,
      gmapAddress,
      hasHairDryer,
      hasWasher,
      hasClothesDryer,
      hasIron,
      hasTivi,
      hasAirCond,
      hasWifi,
      hasKitchen,
      hasParking,
      hasPool,
      hasFireplace,
    } = req.body;

    if (!homeName) {
      // delete newly uploaded image file
      deleteUploadedFile(imgUrl);
      throw new BadRequestException('Home Name is required');
    }

    // delete old image of Home before updating
    deleteUploadedFile(isHomeExist.pic_url);
    try {
      const homeUpdate = await this.prisma.homes.update({
        where: {
          home_id: hid,
        },
        data: {
          home_name: cleanString(homeName),
          type_id: +typeId,
          loc_id: +locId,
          home_description: cleanString(homeDescription) || null,
          home_price: homePrice * 1,
          pic_url: imgUrl,
          amount_guests: amountGuests * 1 || null,
          amount_bedrooms: amountBedrooms * 1 || null,
          amount_beds: amountBeds * 1 || null,
          amount_baths: amountBaths * 1 || null,
          gmap_address: cleanString(gmapAddress) || null,
          has_hair_dryer: Boolean(hasHairDryer),
          has_washer: Boolean(hasWasher),
          has_clothes_dryer: Boolean(hasClothesDryer),
          has_iron: Boolean(hasIron),
          has_tivi: Boolean(hasTivi),
          has_air_cond: Boolean(hasAirCond),
          has_wifi: Boolean(hasWifi),
          has_kitchen: Boolean(hasKitchen),
          has_parking: Boolean(hasParking),
          has_pool: Boolean(hasPool),
          has_fireplace: Boolean(hasFireplace),
        },
        select: {
          home_id: true,
          home_name: true,
          rental_home_types: {
            select: {
              type_id: true,
              type_name: true,
            },
          },
          home_location: {
            select: {
              loc_id: true,
              loc_name: true,
              loc_city: true,
              loc_national: true,
              loc_pic_url: true,
            },
          },
          home_description: true,
          home_price: true,
          pic_url: true,
          amount_guests: true,
          amount_bedrooms: true,
          amount_beds: true,
          amount_baths: true,
          gmap_address: true,
          has_hair_dryer: true,
          has_washer: true,
          has_clothes_dryer: true,
          has_iron: true,
          has_tivi: true,
          has_air_cond: true,
          has_wifi: true,
          has_kitchen: true,
          has_parking: true,
          has_pool: true,
          has_fireplace: true,
        },
      });

      return homeUpdate;
    } catch (err) {
      // if error => delete newly uploaded image file
      deleteUploadedFile(imgUrl);
      console.log(err);
      throw new InternalServerErrorException(
        'An error occurred while updating Home',
      );
    }
  }

  async createNewHome(req: Request, @UploadedFile() file: Express.Multer.File) {
    // console.log({ file });
    if (!file) throw new BadRequestException(NO_FILE_IN_REQ);
    const arrPath = file.path?.split(path.sep);
    const imgUrl = arrPath?.join('/');

    const {
      homeName,
      typeId,
      locId,
      homeDescription,
      homePrice,
      amountGuests,
      amountBedrooms,
      amountBeds,
      amountBaths,
      gmapAddress,
      hasHairDryer,
      hasWasher,
      hasClothesDryer,
      hasIron,
      hasTivi,
      hasAirCond,
      hasWifi,
      hasKitchen,
      hasParking,
      hasPool,
      hasFireplace,
    } = req.body;

    if (!homeName) {
      // delete newly uploaded image file
      deleteUploadedFile(imgUrl);
      throw new BadRequestException('Home Name is required');
    }

    try {
      const newHome = await this.prisma.homes.create({
        data: {
          home_name: cleanString(homeName),
          type_id: typeId * 1,
          loc_id: locId * 1,
          home_description: cleanString(homeDescription) || null,
          home_price: homePrice * 1,
          pic_url: imgUrl,
          amount_guests: amountGuests * 1 || null,
          amount_bedrooms: amountBedrooms * 1 || null,
          amount_beds: amountBeds * 1 || null,
          amount_baths: amountBaths * 1 || null,
          gmap_address: cleanString(gmapAddress) || null,
          has_hair_dryer: Boolean(hasHairDryer),
          has_washer: Boolean(hasWasher),
          has_clothes_dryer: Boolean(hasClothesDryer),
          has_iron: Boolean(hasIron),
          has_tivi: Boolean(hasTivi),
          has_air_cond: Boolean(hasAirCond),
          has_wifi: Boolean(hasWifi),
          has_kitchen: Boolean(hasKitchen),
          has_parking: Boolean(hasParking),
          has_pool: Boolean(hasPool),
          has_fireplace: Boolean(hasFireplace),
        },
        select: {
          home_id: true,
          home_name: true,
          rental_home_types: {
            select: {
              type_id: true,
              type_name: true,
            },
          },
          home_location: {
            select: {
              loc_id: true,
              loc_name: true,
              loc_city: true,
              loc_national: true,
              loc_pic_url: true,
            },
          },
          home_description: true,
          home_price: true,
          pic_url: true,
          amount_guests: true,
          amount_bedrooms: true,
          amount_beds: true,
          amount_baths: true,
          gmap_address: true,
          has_hair_dryer: true,
          has_washer: true,
          has_clothes_dryer: true,
          has_iron: true,
          has_tivi: true,
          has_air_cond: true,
          has_wifi: true,
          has_kitchen: true,
          has_parking: true,
          has_pool: true,
          has_fireplace: true,
        },
      });
      return newHome;
    } catch (err) {
      // if error => delete newly uploaded image file
      deleteUploadedFile(imgUrl);
      console.log(err);
      throw new InternalServerErrorException(
        'An error occurred while creating new Home',
      );
    }
  }

  async getHomesByLocationId(locId: number) {
    if (!locId)
      throw new BadRequestException('Location Id not found on request');

    const isLocationExist = await this.prisma.home_location.findFirst({
      where: {
        loc_id: locId,
      },
      omit: {
        created_at: true,
        updated_at: true,
      },
    });

    if (!isLocationExist)
      throw new BadRequestException(
        'This location does not exist, please choose another location or create a new',
      );

    const homes = this.prisma.homes.findMany({
      where: {
        loc_id: locId,
      },
      select: {
        home_id: true,
        home_name: true,
        rental_home_types: {
          select: {
            type_id: true,
            type_name: true,
          },
        },
        home_location: {
          select: {
            loc_id: true,
            loc_name: true,
            loc_city: true,
            loc_national: true,
            loc_pic_url: true,
          },
        },
        home_description: true,
        home_price: true,
        pic_url: true,
        amount_guests: true,
        amount_bedrooms: true,
        amount_beds: true,
        amount_baths: true,
        gmap_address: true,
      },
    });

    return homes;
  }

  async deleteHome(hid: number) {
    if (!hid) throw new BadRequestException('Home Id not found on request');

    const isHomeExist = await this.prisma.homes.findFirst({
      where: {
        home_id: hid,
      },
    });
    if (!isHomeExist) throw new NotFoundException('Home does not exist');
    // console.log({ isHomeExist });
    try {
      // delete images of this home before
      deleteUploadedFile(isHomeExist.pic_url);

      await this.prisma.homes.delete({
        where: {
          home_id: hid,
        },
      });

      return {
        deletedHomeId: isHomeExist.home_id,
        deletedHomeName: isHomeExist.home_name,
        deletedDate: new Date(),
      };
    } catch (err) {
      console.log('ERROR:', err);
    }
  }
}

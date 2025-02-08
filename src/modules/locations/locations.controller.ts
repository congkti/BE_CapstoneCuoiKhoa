import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Public } from 'src/common/decorators/public.decorator';
import {
  DecorCreateNewLocation,
  DecorGetAllLoacations,
  DecorGetDetailLocation,
  DecorUpdateLocation,
} from './locations.apply-decorators';
import {
  DecorUploadCloud,
  DecorUploadLocal,
} from 'src/common/multers/upload-file.apply-decorators';
import { Request } from 'express';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post('create-new-location-local')
  @DecorUploadLocal('locationPicture')
  @DecorCreateNewLocation()
  createLocationLocal(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.locationsService.createLocation(req, file);
  }

  @Post('create-new-location-cloud')
  @DecorUploadCloud('locationPicture')
  @DecorCreateNewLocation()
  createLocationCloud(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.locationsService.createLocation(req, file);
  }

  @Get('get-all-locations')
  @DecorGetAllLoacations()
  findAllLoactions() {
    return this.locationsService.findAllLocations();
  }

  @Patch('update-location-local/:lid')
  @DecorUploadLocal('locationPicture')
  @DecorUpdateLocation()
  updateLocationLocal(
    @Param('lid') lid: string,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.locationsService.updateLocation(+lid, req, file);
  }

  @Patch('update-location-cloud/:lid')
  @DecorUploadCloud('locationPicture')
  @DecorUpdateLocation()
  updateLocationCloud(
    @Param('lid') lid: string,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.locationsService.updateLocation(+lid, req, file);
  }

  @Delete('remove-location/:lid')
  removeLocation(@Param('lid') lid: string) {
    return this.locationsService.removeLocation(+lid);
  }

  @Get('get-detail-location-by-id/:lid')
  @DecorGetDetailLocation()
  getDeatailLocation(@Param('lid') lid: string) {
    return this.locationsService.getDeatailLocation(+lid);
  }
}

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
} from './locations.apply-decorators';
import { DecorUploadLocal } from 'src/common/multers/upload-file.apply-decorators';
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
    return this.locationsService.createLocationLocal(req, file);
  }

  @Public()
  @Get('get-all-locations')
  @DecorGetAllLoacations()
  findAllLoactions() {
    return this.locationsService.findAllLoactions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationsService.remove(+id);
  }
}

import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { HomesService } from './homes.service';
import {
  DecorCreateNewHome,
  DecorDeleteHome,
  DecorGetAllHomes,
  DecorGetHomeById,
  DecorGetHomesByLocId,
  DecorUpdateHome,
} from './homes.apply-decorators';
import { Request } from 'express';
import {
  DecorUploadCloud,
  DecorUploadLocal,
} from 'src/common/multers/upload-file.apply-decorators';

@Controller('homes')
export class HomesController {
  constructor(private readonly homesService: HomesService) {}

  @Get('get-all-homes')
  @DecorGetAllHomes()
  getListAllHomes() {
    return this.homesService.getListAllHomes();
  }

  @Get('get-detail-home-by-id/:hid')
  @DecorGetHomeById()
  getDetailHomeById(@Param('hid') hid: string) {
    return this.homesService.getDetailHomeById(+hid);
  }

  @Put('update-home-local/:hid')
  @DecorUploadLocal('homeImage')
  @DecorUpdateHome()
  updateHomeLocal(
    @Param('hid') hid: string,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.homesService.updateHome(+hid, req, file);
  }

  @Put('update-home-cloud/:hid')
  @DecorUploadCloud('homeImage')
  @DecorUpdateHome()
  updateHomeCloud(
    @Param('hid') hid: string,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.homesService.updateHome(+hid, req, file);
  }

  @Post('create-new-home-local')
  @DecorUploadLocal('homeImage')
  @DecorCreateNewHome()
  createNewHomeLocal(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.homesService.createNewHome(req, file);
  }

  @Post('create-new-home-cloud')
  @DecorUploadCloud('homeImage')
  @DecorCreateNewHome()
  createNewHomeCloud(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.homesService.createNewHome(req, file);
  }

  @Get('get-homes-by-location/:locId')
  @DecorGetHomesByLocId()
  getHomesByLocationId(@Param('locId') locId: string) {
    return this.homesService.getHomesByLocationId(+locId);
  }

  @Delete('delete-home/:hid')
  @DecorDeleteHome()
  deleteHome(@Param('hid') hid: string) {
    return this.homesService.deleteHome(+hid);
  }
}

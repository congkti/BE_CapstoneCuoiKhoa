import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  DecorAllUsers,
  DecorGetCurUserInfo,
  DecorRemove,
  DecorRestore,
  DecorUpdateInfo,
} from './users.apply-decorators';
import { Request } from 'express';
import { LoginUser } from 'src/common/decorators/user.decorator';
import { TUser } from '../auth/dto/auth.dto';
import {
  DecorUploadCloud,
  DecorUploadLocal,
} from 'src/common/multers/upload-file.apply-decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @DecorAllUsers()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @DecorAllUsers()
  @Get('get-all-users-pagination')
  findAllPagination(@Req() req: Request) {
    return this.usersService.listUsersPagination(req);
  }

  @DecorGetCurUserInfo()
  @Get('get-cur-user-info')
  getCurUserInfo(@LoginUser() user: TUser) {
    return this.usersService.getCurUserInfo(user);
  }

  @DecorUploadLocal('avatar')
  @DecorUpdateInfo()
  @Patch('update-user-info-avatar-local')
  // update(@Req() req: Request, @Body() body: UpdateUserDto)()
  updateLocal(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateUerInfo(req, file);
  }

  @DecorUploadCloud('avatar')
  @DecorUpdateInfo()
  @Patch('update-user-info-avatar-cloud')
  updateCloud(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateUerInfo(req, file);
  }

  @Delete('delete-user-by-id/:uid')
  @DecorRemove()
  remove(@LoginUser() user: TUser, @Param('uid') uid: string) {
    return this.usersService.remove(user, +uid);
  }

  @Patch('restore-user-by-id/:uid')
  @DecorRestore()
  restore(@LoginUser() user: TUser, @Param('uid') uid: string) {
    return this.usersService.restore(user, +uid);
  }
}

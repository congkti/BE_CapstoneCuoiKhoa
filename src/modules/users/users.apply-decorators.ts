import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { INVALID_FILE_FORMAT } from 'src/common/constant/global.constant';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseMetaData } from 'src/common/decorators/response-mesage.decorator';

// decorators AllUsers api
export const DecorAllUsers = () => {
  return applyDecorators(
    Public(),
    ResponseMetaData('Get all users successful'),
  );
};

// decorators GetCurUserInfo api
export const DecorGetCurUserInfo = () => {
  return applyDecorators(ResponseMetaData('Get current user info successful'));
};

// decorators UpdateInfo api
export const DecorUpdateInfo = () => {
  return applyDecorators(ResponseMetaData('Update user info successful'));
};

// decorators Remove api
export const DecorRemove = () => {
  return applyDecorators(ResponseMetaData('User has been removed'));
};

// decorators Restore api
export const DecorRestore = () => {
  return applyDecorators(
    ResponseMetaData('User has been successfully restored'),
  );
};

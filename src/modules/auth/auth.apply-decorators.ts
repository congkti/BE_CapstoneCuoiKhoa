import { applyDecorators, UseGuards } from '@nestjs/common';
import { ResponseMetaData } from 'src/common/decorators/response-mesage.decorator';
import { LocalAuthGuard } from './passport-guard/local-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

// decorators Register api
export const DecorRegister = () => {
  return applyDecorators(
    Public(),
    ResponseMetaData('User registration successful', 201),
  );
};

// decorators Login api
export const DecorLogin = () => {
  return applyDecorators(
    Public(),
    UseGuards(LocalAuthGuard),
    ResponseMetaData('Login successful'),
  );
};

// decorators RefreshToken api
export const DecorRefreshToken = () => {
  return applyDecorators(
    Public(),
    ResponseMetaData('Token renewal successful. Please update!', 201),
  );
};

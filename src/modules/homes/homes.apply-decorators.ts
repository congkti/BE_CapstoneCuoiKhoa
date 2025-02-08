import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseMetaData } from 'src/common/decorators/response-mesage.decorator';

// decorators GetAllHomes api
export const DecorGetAllHomes = () => {
  return applyDecorators(
    Public(),
    ResponseMetaData('Get lists of homes successful'),
  );
};

// decorators GetHomeById api
export const DecorGetHomeById = () => {
  return applyDecorators(
    Public(),
    ResponseMetaData('Get home detail successful'),
  );
};

// decorators UpdateHome api
export const DecorUpdateHome = () => {
  return applyDecorators(ResponseMetaData('Update Home successful'));
};

// decorators CreateNewHome api
export const DecorCreateNewHome = () => {
  return applyDecorators(ResponseMetaData('Create new home successful', 201));
};

// decorators GetHomesByLocId api
export const DecorGetHomesByLocId = () => {
  return applyDecorators(ResponseMetaData('Get Homes successful'));
};

// decorators DeleteHome api
export const DecorDeleteHome = () => {
  return applyDecorators(ResponseMetaData('Delete home successful'));
};

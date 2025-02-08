import { applyDecorators } from '@nestjs/common';
import { ResponseMetaData } from 'src/common/decorators/response-mesage.decorator';

// decorators GetAllLoacations api
export const DecorGetAllLoacations = () => {
  return applyDecorators(ResponseMetaData('Get all locations successfull'));
};

// decorators CreateNewLocation api
export const DecorCreateNewLocation = () => {
  return applyDecorators(
    ResponseMetaData('Create new location successful', 201),
  );
};

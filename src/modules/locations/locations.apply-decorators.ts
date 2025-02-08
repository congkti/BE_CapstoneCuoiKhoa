import { applyDecorators } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseMetaData } from 'src/common/decorators/response-mesage.decorator';

// decorators GetAllLoacations api
export const DecorGetAllLoacations = () => {
  return applyDecorators(
    Public(),
    ResponseMetaData('Get all locations successfull'),
  );
};

// decorators GetDetailLocation api
export const DecorGetDetailLocation = () => {
  return applyDecorators(
    Public(),
    ResponseMetaData('Get location detail successful'),
  );
};

// decorators CreateNewLocation api
export const DecorCreateNewLocation = () => {
  return applyDecorators(
    ResponseMetaData('Create new location successful', 201),
  );
};

// decorators UpdateLocation api
export const DecorUpdateLocation = () => {
  return applyDecorators(ResponseMetaData('Update Location successful'));
};

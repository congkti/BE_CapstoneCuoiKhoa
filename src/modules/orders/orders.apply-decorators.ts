import { applyDecorators } from '@nestjs/common';
import { ResponseMetaData } from 'src/common/decorators/response-mesage.decorator';

// decorators GetAllOrrders api
export const DecorGetAllOrrders = () => {
  return applyDecorators(
    ResponseMetaData('Get lists of booked Homes successful'),
  );
};

// decorators GetDetailOrder api
export const DecorGetDetailOrder = () => {
  return applyDecorators(ResponseMetaData('Get order detail successful'));
};

// decorators CreateNewOrder api
export const DecorCreateNewOrder = () => {
  return applyDecorators(ResponseMetaData('Create new order successful', 201));
};

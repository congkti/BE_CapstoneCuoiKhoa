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

// decorators UpdateOrder api
export const DecorUpdateOrder = () => {
  return applyDecorators(ResponseMetaData('Update order successful'));
};

// decorators DeleteteOrrder api
export const DecorDeleteteOrrder = () => {
  return applyDecorators(ResponseMetaData('Delete order successful'));
};

// decorators GetOrdersByCustomerId api
export const DecorGetOrdersByCustomerId = () => {
  return applyDecorators(
    ResponseMetaData('Get lists orders of customer successful'),
  );
};

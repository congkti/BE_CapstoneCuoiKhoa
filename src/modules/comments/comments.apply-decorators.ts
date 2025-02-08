import { applyDecorators } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseMetaData } from 'src/common/decorators/response-mesage.decorator';

// decorators AddNewComment api
export const DecorAddNewComment = () => {
  return applyDecorators(ResponseMetaData('Add new comment successful', 201));
};

// decorators GetAllComments api
export const DecorGetAllComments = () => {
  return applyDecorators(
    Public(),
    ResponseMetaData('Get list of all comments successful'),
  );
};

// decorators GetBannedComments api
export const DecorGetBannedComments = () => {
  return applyDecorators(
    ResponseMetaData('Get all Banned comments successful'),
  );
};

// decorators ViewDetailComment api
export const DecorViewDetailComment = () => {
  return applyDecorators(
    ResponseMetaData('Get view detail comment successful'),
  );
};

// decorators BlockComment api
export const DecorBlockComment = () => {
  return applyDecorators(ResponseMetaData('Blocked this comment successful'));
};

// decorators UnBlockComment api
export const DecorUnBlockComment = () => {
  return applyDecorators(ResponseMetaData('Unblocked this comment successful'));
};

// decorators RemoveComment api
export const DecorRemoveComment = () => {
  return applyDecorators(ResponseMetaData('Removed this comment successful'));
};

// decorators UpdateComment api
export const DecorUpdateComment = () => {
  return applyDecorators(ResponseMetaData('Updated this comment successful'));
};

// decorators GetComments api
export const DecorGetComments = () => {
  return applyDecorators(Public(), ResponseMetaData('Get comments successful'));
};

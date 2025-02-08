import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  DecorAddNewComment,
  DecorBlockComment,
  DecorGetAllComments,
  DecorGetBannedComments,
  DecorGetComments,
  DecorRemoveComment,
  DecorUnBlockComment,
  DecorUpdateComment,
  DecorViewDetailComment,
} from './comments.apply-decorators';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('add-new-comment')
  @DecorAddNewComment()
  create(@Body() body: CreateCommentDto) {
    return this.commentsService.create(body);
  }

  @Get('list-all')
  @DecorGetAllComments()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get('list-all-banned')
  @DecorGetBannedComments()
  findAllBanned() {
    return this.commentsService.findAllBanned();
  }

  @Get('view-detail-comment/:cmtId')
  @DecorViewDetailComment()
  viewDetailComment(@Param('cmtId') cmtId: string) {
    return this.commentsService.viewDetailComment(+cmtId);
  }

  @Put('block-comment/:cmtId')
  @DecorBlockComment()
  blockComment(@Param('cmtId') cmtId: string, @Body() body: any) {
    return this.commentsService.blockComment(+cmtId, body?.reasonBlocked);
  }

  @Put('unblock-comment/:cmtId')
  @DecorUnBlockComment()
  unblockComment(@Param('cmtId') cmtId: string) {
    return this.commentsService.unBlockComment(+cmtId);
  }

  @Delete('remove-comment/:cmtId')
  @DecorRemoveComment()
  removeComment(@Param('cmtId') cmtId: string) {
    return this.commentsService.removeComment(+cmtId);
  }

  @Patch('update-comment/:cmtId')
  @DecorUpdateComment()
  updateComment(@Param('cmtId') cmtId: string, @Body() body: CreateCommentDto) {
    return this.commentsService.updateComment(+cmtId, body);
  }

  @Get('get-comments-of-home/:hid')
  @DecorGetComments()
  getCommentsOfHome(@Param('hid') hid: string) {
    return this.commentsService.getCommentsOfHome(+hid);
  }

  @Get('get-comments-of-user/:uid')
  @DecorGetComments()
  getCommentsOfUser(@Param('uid') uid: string) {
    return this.commentsService.getCommentsOfUser(+uid);
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { cleanString } from 'src/common/utils/handle-string.util';
import {
  BLOCK_COMMENT_KEY,
  COMMENT_FIELD_IS_REQUIRED,
  COMMENT_SPAM_NOTICE,
} from './config.comments';
import { APP_NAME } from 'src/common/constant/global.constant';

@Injectable()
export class CommentsService {
  constructor(
    public prisma: PrismaService,
    // public configService: ConfigService,
  ) {}

  async create(body: CreateCommentDto) {
    const { userId, homeId, commentContent, commentRate } = body;
    // console.log({ userId, homeId, commentContent, commentRate });
    if (!userId || !homeId || !commentContent)
      throw new BadRequestException(COMMENT_FIELD_IS_REQUIRED);

    // restrict spam
    const isSpam = await this.prisma.comments.findMany({
      where: {
        AND: [
          { user_id: userId * 1 },
          { home_id: homeId * 1 },
          { comment_content: cleanString(commentContent) },
        ],
      },
    });
    console.log('listSpam: ', isSpam);
    if (isSpam.length !== 0) throw new ConflictException(COMMENT_SPAM_NOTICE);

    const newComment = await this.prisma.comments.create({
      data: {
        user_id: userId * 1,
        home_id: homeId * 1,
        comment_content: cleanString(commentContent),
        comment_rate: commentRate * 1 || null,
      },
      omit: {
        is_banned: true,
        created_at: true,
        updated_at: true,
      },
    });

    return newComment;
  }

  async findAll() {
    const comments = await this.prisma.comments.findMany({
      where: {
        is_banned: false,
      },
      omit: {
        is_banned: true,
        created_at: true,
        updated_at: true,
      },
    });
    return {
      totalComents: comments.length,
      commentItems: comments,
    };
  }

  async findAllBanned() {
    const comments = await this.prisma.comments.findMany({
      where: {
        is_banned: true,
      },
      omit: {
        created_at: true,
        updated_at: true,
      },
    });
    return {
      totalComents: comments.length,
      commentItems: comments,
    };
  }

  async viewDetailComment(cmtId: number) {
    // for admin or editor
    const comment = await this.prisma.comments.findFirst({
      where: {
        comment_id: cmtId,
      },
      omit: {
        user_id: true,
        home_id: true,
      },
      include: {
        users: {
          omit: {
            password: true,
            first_name: true,
            last_name: true,
            birth_day: true,
            avatar: true,
            phone: true,
            address: true,
            created_at: true,
            updated_at: true,
          },
        },
        homes: {
          omit: {
            created_at: true,
            updated_at: true,
          },
          include: {
            rental_home_types: {
              omit: {
                created_at: true,
                updated_at: true,
              },
            },
            home_location: {
              omit: {
                created_at: true,
                updated_at: true,
              },
            },
          },
        },
      },
    });

    const { users, homes, ...resComment } = comment;
    if (resComment.is_banned === true) {
      const reasonBlocked =
        resComment.comment_content?.split(BLOCK_COMMENT_KEY)[1];

      return {
        reasonBlocked,
        ...resComment,
        commentAuthor: users,
        commentOnHome: homes,
      };
    } else {
      return {
        ...resComment,
        commentAuthor: users,
        commentOnHome: homes,
      };
    }
  }

  async blockComment(cmtId: number, reasonBlocked: string) {
    // for admin or editor
    console.log(reasonBlocked);
    const isCommentExist = await this.prisma.comments.findFirst({
      where: {
        AND: [{ comment_id: cmtId }, { is_banned: false }],
      },
    });
    if (!isCommentExist)
      throw new ConflictException(`Comment id#${cmtId} not found or blocked`);

    const newCommentContent =
      isCommentExist.comment_content +
      BLOCK_COMMENT_KEY +
      cleanString(reasonBlocked);
    const setBlockComment = await this.prisma.comments.update({
      where: {
        comment_id: cmtId,
      },
      data: {
        comment_content: newCommentContent,
        is_banned: true,
      },
      omit: {
        created_at: true,
        updated_at: true,
      },
    });

    return {
      reasonBlocked: cleanString(reasonBlocked),
      ...setBlockComment,
    };
  }

  async unBlockComment(cmtId: number) {
    // for admin or editor
    const isCommentBlocked = await this.prisma.comments.findFirst({
      where: {
        AND: [{ comment_id: cmtId }, { is_banned: true }],
      },
    });
    if (!isCommentBlocked)
      throw new ConflictException(`Comment id#${cmtId} not found or Unblocked`);

    const newCommentContent =
      isCommentBlocked.comment_content?.split(BLOCK_COMMENT_KEY)[0];

    const setUnBlockComment = await this.prisma.comments.update({
      where: {
        comment_id: cmtId,
      },
      data: {
        comment_content: newCommentContent,
        is_banned: false,
      },
      omit: {
        created_at: true,
        updated_at: true,
      },
    });

    return setUnBlockComment;
  }

  async removeComment(cmtId: number) {
    const isCommentExist = await this.prisma.comments.findFirst({
      where: {
        comment_id: cmtId,
      },
    });
    if (!isCommentExist)
      throw new NotFoundException(`Comment id#${cmtId} not found`);

    try {
      await this.prisma.comments.delete({
        where: {
          comment_id: cmtId,
        },
      });

      return {
        deletedCommentId: isCommentExist.comment_id,
        deletedCommentContent: isCommentExist.comment_content,
        deletedDate: new Date(),
      };
    } catch (err) {
      console.log('ERROR WHEN DELETING COMMENT: ', err);
    }
  }

  async updateComment(cmtId: number, body: CreateCommentDto) {
    const isCommentExist = await this.prisma.comments.findFirst({
      where: {
        comment_id: cmtId,
      },
    });
    if (!isCommentExist)
      throw new NotFoundException(`Comment id#${cmtId} not found`);

    const { commentContent, commentRate } = body;
    if (!commentContent)
      throw new BadRequestException('Comment content is required in req');

    // restrict spam
    const isSpam = await this.prisma.comments.findMany({
      where: {
        AND: [
          { user_id: isCommentExist.user_id * 1 },
          { home_id: isCommentExist.home_id * 1 },
          { comment_content: cleanString(commentContent) },
        ],
      },
      omit: {
        created_at: true,
        updated_at: true,
      },
    });
    console.log('listSpam: ', isSpam);
    if (isSpam.length !== 0) throw new ConflictException(COMMENT_SPAM_NOTICE);

    try {
      const commentUpdated = await this.prisma.comments.update({
        where: {
          comment_id: cmtId,
        },
        data: {
          comment_content: cleanString(commentContent),
          comment_rate: commentRate * 1 || null,
        },
        omit: {
          created_at: true,
          updated_at: true,
        },
      });

      return commentUpdated;
    } catch (err) {
      console.log('ERROR WHEN DELETING COMMENT: ', err);
    }
  }

  async getCommentsOfHome(hid: number) {
    if (!hid) throw new BadRequestException('Home ID# is required in req');
    const comments = await this.prisma.comments.findMany({
      where: {
        home_id: hid,
        is_banned: false,
      },
      omit: {
        created_at: true,
        updated_at: true,
        is_banned: true,
      },
    });

    if (comments.length === 0)
      throw new NotFoundException(
        `This Home #${hid} has no comments yet. OR Home is not exist`,
      );

    return comments;
  }

  async getCommentsOfUser(uid: number) {
    if (!uid) throw new BadRequestException('User ID# is required in req');

    const comments = await this.prisma.comments.findMany({
      where: {
        user_id: uid,
        is_banned: false,
      },
      omit: {
        created_at: true,
        updated_at: true,
        is_banned: true,
      },
    });

    if (comments.length === 0)
      throw new NotFoundException(
        `This user #${uid} has no comments on the ${APP_NAME} site yet.`,
      );

    return comments;
  }
}

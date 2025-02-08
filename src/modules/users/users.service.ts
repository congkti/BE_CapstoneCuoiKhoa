import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UploadedFile,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Request } from 'express';
import { users } from '@prisma/client';
import { isValid, parse } from 'date-fns';
import { cleanString } from 'src/common/utils/handle-string.util';
import * as path from 'node:path';
import {
  NO_FILE_IN_REQ,
  USER_NAME_NOT_AVAILABLE,
} from 'src/common/constant/global.constant';
import { ConfigService } from '@nestjs/config';
import { TUser } from '../auth/dto/auth.dto';
import deleteUploadedFile from 'src/common/multers/delete-uploaded-file.multer';

@Injectable()
export class UsersService {
  constructor(
    public prisma: PrismaService,
    public configService: ConfigService,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const users = await this.prisma.users.findMany({
      omit: {
        password: true,
        // is_deleted: true,
        created_at: true,
        updated_at: true,
      },
    });
    return users;
  }

  async listUsersPagination(req: Request) {
    let { page, pageSize } = req.query as any;
    page = page * 1 > 0 ? page * 1 : 1;
    pageSize = pageSize * 1 > 0 ? pageSize * 1 : 3;
    const totalItem = await this.prisma.users.count();
    const totalPage = Math.ceil(totalItem / pageSize);

    const users = await this.prisma.users.findMany({
      omit: {
        password: true,
        // is_deleted: true,
        created_at: true,
        updated_at: true,
      },
      // take <=> LIMIT trong SQL
      take: pageSize,
      // skip <=> OFFSET trong SQL
      skip: (page - 1) * pageSize,

      orderBy: {
        created_at: 'desc',
      },
    });
    return {
      page,
      pageSize,
      totalItem,
      totalPage,
      items: users || [],
    };
  }

  getCurUserInfo(user: TUser) {
    return user;
  }

  async updateUerInfo(req: Request, @UploadedFile() file: Express.Multer.File) {
    // console.log(req.user);
    // console.log(req.body);
    // console.log({ file });
    if (!file) throw new BadRequestException(NO_FILE_IN_REQ);

    const arrPath = file.path?.split(path.sep);
    const imgUrl = arrPath?.join('/');
    // const imgUrl = file.path.replaceAll(path.sep, "/"); // ES2021

    const user: users = req.user as users; // Force type users to fix unknow type of req.user
    const { user_id, email } = user;

    const { userName, firstName, lastName, birthDay, phone, address } =
      req.body;

    // check user_name exist
    const isUserExist =
      userName &&
      (await this.prisma.users.findFirst({
        where: {
          user_name: userName,
        },
      }));
    if (isUserExist && user_id !== isUserExist.user_id) {
      // delete newly uploaded image file
      deleteUploadedFile(imgUrl);
      throw new BadRequestException(USER_NAME_NOT_AVAILABLE);
    }

    const fullName =
      !firstName && !lastName
        ? null
        : !firstName
          ? lastName
          : !lastName
            ? firstName
            : `${firstName} ${lastName}`;

    const isoDateBirthDay =
      birthDay && isValid(parse(birthDay, 'dd/MM/yyyy', new Date()))
        ? parse(birthDay, 'dd/MM/yyyy', new Date())
        : null;

    // delete old avatar in req.user before updating
    deleteUploadedFile(user.avatar);
    try {
      const newUpdateUser = await this.prisma.users.update({
        where: {
          user_id,
          email,
        },
        data: {
          avatar: imgUrl,
          user_name: userName,
          first_name: cleanString(firstName) || null,
          last_name: cleanString(lastName) || null,
          full_name: cleanString(fullName) || null,
          birth_day: isoDateBirthDay || null,
          phone: phone || null,
          address: cleanString(address) || null,
        },
        omit: {
          password: true,
          is_deleted: true,
          created_at: true,
          updated_at: true,
        },
      });
      return newUpdateUser;
    } catch (err) {
      // if error => delete newly uploaded image file
      deleteUploadedFile(imgUrl);
      console.log(err);
      throw new InternalServerErrorException(
        'An error occurred while updating User info',
      );
    }
  }

  async remove(user: TUser, uid: number) {
    // console.log('LoginBy >>', user);
    const isAdmin = await this.prisma.users.findFirst({
      where: {
        user_id: uid,
      },
      select: {
        user_id: true,
        email: true,
        user_name: true,
        roles: true,
      },
    });

    if (
      isAdmin.email === this.configService.get<string>('EMAIL_SUP_ADMIN') &&
      isAdmin.roles.role_name === this.configService.get<string>('ROLE_ADMIN')
    )
      throw new BadRequestException('Cannot delete admin account');

    const userDeleted = await this.prisma.users.update({
      where: {
        user_id: uid,
      },
      data: {
        is_deleted: true,
      },
    });

    return {
      userDeleted: {
        userId: userDeleted.user_id,
        userEmail: userDeleted.email,
        isDeleted: userDeleted.is_deleted,
      },
      deletedAt: userDeleted.updated_at,
      deletedBy: {
        uid: user.user_id,
        email: user.email,
        userName: user.user_name,
      },
    };
  }

  async restore(user: TUser, uid: number) {
    // console.log('LoginBy >>', user);
    const userRestored = await this.prisma.users.update({
      where: {
        user_id: uid,
      },
      data: {
        is_deleted: false,
      },
    });

    return {
      userRestored: {
        userId: userRestored.user_id,
        userEmail: userRestored.email,
        isDeleted: userRestored.is_deleted,
      },
      restoredAt: userRestored.updated_at,
      restoredBy: {
        uid: user.user_id,
        email: user.email,
        userName: user.user_name,
      },
    };
  }
}

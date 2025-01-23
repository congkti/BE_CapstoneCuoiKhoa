import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  INVALID_USER,
  USER_IS_BANNED,
} from 'src/common/constant/global.constant';

@Injectable()
export class PassportService {
  constructor(public prisma: PrismaService) {}

  // validate and return valid user
  async validateUser(identifier: string, pass: string) {
    const userExits = await this.prisma.users.findFirst({
      where: {
        OR: [
          { email: identifier }, // by email
          { user_name: identifier }, // by username
        ],
      },
    });

    // check email exits?
    if (!userExits) throw new BadRequestException(INVALID_USER); // user unregistered

    // email exits -> check pw
    const dbPass = userExits.password;
    const isPass = bcrypt.compareSync(pass, dbPass);
    if (!isPass) throw new BadRequestException(INVALID_USER); // pw is wrong

    // pw match -> check banned user
    if (userExits.is_deleted === true)
      throw new UnauthorizedException(USER_IS_BANNED);

    const {
      password,
      is_deleted,
      first_name,
      last_name,
      created_at,
      updated_at,
      ...resUser
    } = userExits; //-> ko trả pw +... còn lại nạp vào resUser
    return resUser;
  }
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RegisterDto, TUser } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { cleanString } from 'src/common/utils/handle-string.util';
import { TokenService } from './tokens.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { USER_NOT_EXIST } from 'src/common/constant/global.constant';
import { isValid, parse } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    public prisma: PrismaService,
    public tokenService: TokenService,
    private jwtService: JwtService,
    public configService: ConfigService,
  ) {}

  async register(body: RegisterDto) {
    // console.log(body);
    const { email, password, firstName, lastName, birthDay, phone, address } =
      body;

    // check unregistered email?
    const userExits = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (userExits)
      throw new BadRequestException(
        'Email has registered account. Please login!',
      );
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

    const newUser = await this.prisma.users.create({
      data: {
        email,
        password: bcrypt.hashSync(password, 10),
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

    return newUser;
  }

  async login(user: TUser) {
    // console.log(user);
    // user available -> create token
    const tokens = this.tokenService.createTokens({
      user_id: user.user_id,
      email: user.email,
    });

    // Must return a object (not json) for the interceptor to get response
    return {
      ...user,
      ...tokens,
    };
  }

  async callRefreshToken(headers: any) {
    const [type, mainseven] = headers.authorization?.split(' ') ?? [];
    const babythree = headers.babythree;

    // no tokens -> life is nothing -> 401
    if (!mainseven || !babythree || type !== 'Bearer')
      throw new UnauthorizedException(
        'Request submitted is incorrect or missing. Please check again.',
      );

    // verify secret key in token vs in .env
    try {
      const deMain7 = this.jwtService.verify(mainseven, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        ignoreExpiration: true,
      });
      const deBaby3 = this.jwtService.verify(babythree, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        ignoreExpiration: false,
      });

      // check user in tokens vs user in db -> 3 steps
      if (deBaby3.userId !== deMain7.userId || deBaby3.email !== deMain7.email)
        throw new UnauthorizedException();
      const user = await this.prisma.users.findUnique({
        where: {
          user_id: deBaby3.userId,
        },
        select: {
          user_id: true,
          email: true,
        },
      });
      if (!user) throw new UnauthorizedException(USER_NOT_EXIST); //401

      // create new tokens
      const tokens = this.tokenService.createTokens({
        user_id: user.user_id,
        email: user.email,
      });

      return {
        ...user,
        ...tokens,
      };
    } catch (err) {
      // catch error 500 -> 401
      throw new UnauthorizedException(
        'Token renewal failed. Please login again.',
      );
    }
  }
}

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'protect') {
  constructor(
    public configService: ConfigService,
    public prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  } //=> payload

  async validate(payload: any) {
    // console.log({ payload });
    const user = await this.prisma.users.findUnique({
      where: {
        user_id: payload.userId,
      },
      omit: {
        password: true,
        is_deleted: true,
        created_at: true,
        updated_at: true,
      },
    });
    // console.log(user);

    return user;
  }
}

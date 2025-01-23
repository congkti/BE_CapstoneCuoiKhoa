import { Injectable } from '@nestjs/common';
import { TUserTokens } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    public configService: ConfigService,
  ) {}
  // Tạo token: dùng ConfigService NestJS đọc env
  createTokens(user: TUserTokens) {
    const acT = this.jwtService.sign(
      { userId: user.user_id, email: user.email },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES'),
      },
    );

    const reT = this.jwtService.sign(
      { userId: user.user_id, email: user.email },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES'),
      },
    );
    return { acT, reT };
  }
}

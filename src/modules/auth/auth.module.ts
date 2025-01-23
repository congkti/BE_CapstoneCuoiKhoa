import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './tokens.service';
import { JwtStrategy } from './passport-strategy/jwt.strategy';
import { LocalStrategy } from './passport-strategy/local.strategy';
import { PassportService } from './passport.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    TokenService,
    JwtService,
    JwtStrategy,
    LocalStrategy,
    PassportService,
  ],
})
export class AuthModule {}

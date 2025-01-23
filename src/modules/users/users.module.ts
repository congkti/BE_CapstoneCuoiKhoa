import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, ConfigService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { HomesService } from './homes.service';
import { HomesController } from './homes.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Module({
  controllers: [HomesController],
  providers: [HomesService, PrismaService],
})
export class HomesModule {}

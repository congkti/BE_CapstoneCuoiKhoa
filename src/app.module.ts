import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { HomesModule } from './modules/homes/homes.module';
import { OrdersModule } from './modules/orders/orders.module';
import { LocationsModule } from './modules/locations/locations.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    HomesModule,
    OrdersModule,
    LocationsModule,
    CommentsModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  DecorCreateNewOrder,
  DecorGetAllOrrders,
  DecorGetDetailOrder,
} from './orders.apply-decorators';
import { TCreateOrder } from './dto/orders.dto';
import { LoginUser } from 'src/common/decorators/user.decorator';
import { TUser } from '../auth/dto/auth.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('get-all-orders')
  @DecorGetAllOrrders()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get('get-detail-order-by-id/:bid')
  @DecorGetDetailOrder()
  getDetailOrderById(@Param('bid') bid: string) {
    return this.ordersService.getDetailOrderById(+bid);
  }

  @Post('create-new-order')
  @DecorCreateNewOrder()
  createNewOrder(@Body() body: TCreateOrder, @LoginUser() user: TUser) {
    return this.ordersService.createNewOrder(body, user);
  }
}

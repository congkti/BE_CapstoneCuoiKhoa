import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
  DecorCreateNewOrder,
  DecorDeleteteOrrder,
  DecorGetAllOrrders,
  DecorGetDetailOrder,
  DecorGetOrdersByCustomerId,
  DecorUpdateOrder,
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

  @Put('update-order-by-id/:bid')
  @DecorUpdateOrder()
  updateOrderById(
    @Param('bid') bid: string,
    @Body() body: TCreateOrder,
    @LoginUser() user: TUser,
  ) {
    return this.ordersService.updateOrderById(+bid, body, user);
  }

  @Delete('delete-order-by-id/:bid')
  @DecorDeleteteOrrder()
  deleteOrderById(@Param('bid') bid: string) {
    return this.ordersService.deleteOrderById(+bid);
  }

  @Get('get-orders-by-customer-id/:cid')
  @DecorGetOrdersByCustomerId()
  getOrdersByCustomerId(@Param('cid') cid: string) {
    return this.ordersService.getOrdersByCustomerId(+cid);
  }
}

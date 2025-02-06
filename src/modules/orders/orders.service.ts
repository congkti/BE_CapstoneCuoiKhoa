import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { TUser } from '../auth/dto/auth.dto';
import { TCreateOrder } from './dto/orders.dto';
import { isValid, parse } from 'date-fns';
import { APP_NAME } from 'src/common/constant/global.constant';

@Injectable()
export class OrdersService {
  constructor(
    public prisma: PrismaService,
    // public configService: ConfigService,
  ) {}

  async getAllOrders() {
    const orders = await this.prisma.book_homes.findMany({
      omit: {
        created_at: true,
        updated_at: true,
      },
    });
    return orders;
  }

  async getDetailOrderById(bid: number) {
    // console.log(bid);

    const order = await this.prisma.book_homes.findFirst({
      where: {
        book_id: bid,
      },
      omit: {
        created_at: true,
        updated_at: true,
      },
    });
    // check order code
    if (!order) throw new BadRequestException('Order code does not exist');

    return order;
  }

  async createNewOrder(body: TCreateOrder, user: TUser) {
    const {
      homeId,
      customerUserId,
      amountAdults,
      amountChildren,
      amountBaby,
      checkinDate,
      checkoutDate,
    } = body;

    if (!homeId) throw new BadRequestException('Please provide a HomeId');
    // Check if customer does not exist
    const isCustomer =
      customerUserId &&
      (await this.prisma.users.findFirst({
        where: {
          user_id: customerUserId * 1,
        },
      }));
    if (customerUserId && !isCustomer)
      throw new BadRequestException('The customer you chose does not exist');

    const customerId = customerUserId ? customerUserId * 1 : user.user_id * 1;
    const isoDateCheckIn =
      checkinDate && isValid(parse(checkinDate, 'dd/MM/yyyy', new Date()))
        ? parse(checkinDate, 'dd/MM/yyyy', new Date())
        : null;
    const isoDateCheckOut =
      checkoutDate && isValid(parse(checkoutDate, 'dd/MM/yyyy', new Date()))
        ? parse(checkoutDate, 'dd/MM/yyyy', new Date())
        : null;

    if (isoDateCheckOut < isoDateCheckIn)
      throw new BadRequestException(
        'Check-out date must be greater than Check-in date',
      );

    const newOrder = await this.prisma.book_homes.create({
      data: {
        home_id: homeId * 1,
        customer_user_id: customerId * 1,
        amount_adults: amountAdults * 1,
        amount_children: amountChildren * 1,
        amount_baby: amountBaby * 1,
        checkin_date: isoDateCheckIn,
        checkout_date: isoDateCheckOut,
        booker_user_id: +user.user_id,
      },
      omit: {
        created_at: true,
        updated_at: true,
      },
    });

    return newOrder;
  }

  async updateOrderById(bid: number, body: TCreateOrder, user: TUser) {
    const {
      homeId,
      customerUserId,
      amountAdults,
      amountChildren,
      amountBaby,
      checkinDate,
      checkoutDate,
    } = body;

    if (!homeId) throw new BadRequestException('Please provide a HomeId');
    // Check if customer does not exist
    const isCustomer =
      customerUserId &&
      (await this.prisma.users.findFirst({
        where: {
          user_id: customerUserId * 1,
        },
      }));
    if (customerUserId && !isCustomer)
      throw new BadRequestException('The customer you chose does not exist');

    const customerId = customerUserId ? customerUserId * 1 : user.user_id * 1;
    const isoDateCheckIn =
      checkinDate && isValid(parse(checkinDate, 'dd/MM/yyyy', new Date()))
        ? parse(checkinDate, 'dd/MM/yyyy', new Date())
        : null;
    const isoDateCheckOut =
      checkoutDate && isValid(parse(checkoutDate, 'dd/MM/yyyy', new Date()))
        ? parse(checkoutDate, 'dd/MM/yyyy', new Date())
        : null;

    if (isoDateCheckOut < isoDateCheckIn)
      throw new BadRequestException(
        'Check-out date must be greater than Check-in date',
      );

    const orderNewUpdate = await this.prisma.book_homes.update({
      where: {
        book_id: bid,
      },
      data: {
        home_id: homeId * 1,
        customer_user_id: customerId * 1,
        amount_adults: amountAdults * 1,
        amount_children: amountChildren * 1,
        amount_baby: amountBaby * 1,
        checkin_date: isoDateCheckIn,
        checkout_date: isoDateCheckOut,
        booker_user_id: +user.user_id,
      },
      omit: {
        created_at: true,
        updated_at: true,
      },
    });

    return orderNewUpdate;
  }

  async deleteOrderById(bid: number) {
    if (!bid) throw new BadRequestException('Booking Id not found on request');

    const isOrderExist = await this.prisma.book_homes.findFirst({
      where: {
        book_id: bid,
      },
    });
    if (!isOrderExist) throw new NotFoundException('Order does not exist');

    await this.prisma.book_homes.delete({
      where: {
        book_id: bid,
      },
    });

    return {
      deletedOrderId: isOrderExist.book_id,
      deletedCustomerId: isOrderExist.customer_user_id,
      userDeletedId: isOrderExist.booker_user_id,
      deletedDate: new Date(),
    };
  }

  async getOrdersByCustomerId(cid: number) {
    if (!cid) throw new BadRequestException('Customer Id not found on request');
    // check unregistered custormer?
    const userExits = await this.prisma.users.findFirst({
      where: {
        user_id: cid,
      },
    });

    if (!userExits)
      throw new BadRequestException(
        `Customer has not registered an account. Please register as a member of  ${APP_NAME}!`,
      );

    const orders = await this.prisma.book_homes.findMany({
      where: {
        customer_user_id: cid,
      },
      omit: {
        created_at: true,
        updated_at: true,
      },
    });

    if (orders.length === 0)
      throw new NotFoundException(`Customer has no orders on ${APP_NAME}`);

    return orders;
  }
}

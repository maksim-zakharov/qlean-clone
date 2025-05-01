import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { Order, OrderStatus } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('/api/executor')
export class ExecutorController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/orders')
  getOrders(@Req() req) {
    return this.ordersService.getAllByExecutor(req.user.id).then((r) =>
      r.map((o) => ({
        ...o,
        status: o.date > new Date() ? o.status : OrderStatus.completed,
      })),
    );
  }

  @Post('/orders/:id/complete')
  async completeOrder(@Param('id') id: number, @Req() req) {
    const item = await this.ordersService.getById(Number(id), req.user.id);

    item.status = OrderStatus.completed;

    return this.ordersService.update(item);
  }

  @Post('/orders/:id/processed')
  async processedOrder(@Param('id') id: number, @Req() req) {
    const item = await this.ordersService.getById(Number(id), req.user.id);

    item.status = OrderStatus.processed;

    return this.ordersService.update(item);
  }
}

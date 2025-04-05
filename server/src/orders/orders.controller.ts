import {Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards} from '@nestjs/common';
import {Order, OrderStatus} from "@prisma/client";
import {OrdersService} from "./orders.service";
import {AuthGuard} from "@nestjs/passport";

@UseGuards(AuthGuard('jwt'))
@Controller('/api/orders')
export class OrdersController {

    constructor(private readonly ordersService: OrdersService) {
    }

    @Get('')
    getOrders(@Query() {userId}: { userId?: Order['userId'] }) {
        return this.ordersService.getAll(userId).then(r => r.map(o => ({
            ...o,
            status: o.date > new Date() ? o.status : OrderStatus.completed
        })));
    }

    @Get('/:id')
    getOrderById(@Param('id') id: number, @Query() {userId}: { userId?: Order['userId'] }) {
        return this.ordersService.getById(Number(id), userId);
    }

    @Put('/:id')
    editOrder(@Param('id') id: number, @Body() body: Order): any {
        return this.ordersService.update(body);
    }

    @Patch('/:id')
    async patchOrder(@Param('id') id: number, @Body() body: Order) {
        const item = await this.ordersService.getById(Number(id), body.userId);

        Object.assign(item, body);

        return this.ordersService.update(item);
    }

    @Post('/:id/cancel')
    async cancelOrder(@Param('id') id: number, @Body() body: Order) {
        const item = await this.ordersService.getById(Number(id), body.userId);

        item.status = OrderStatus.canceled;

        return this.ordersService.update(item);
    }

    @Post('')
    addOrder(@Body() body: Order) {
        return this.ordersService.create(body);
    }
}

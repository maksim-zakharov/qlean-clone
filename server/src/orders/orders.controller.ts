import {Body, Controller, Get, Param, Patch, Post, Put, Query} from '@nestjs/common';
import {Order} from "@prisma/client";
import {OrdersService} from "./orders.service";

@Controller('/api/orders')
export class OrdersController {

    constructor(private readonly ordersService: OrdersService) {
    }

    @Get('')
    getOrders(@Query() {userId}: { userId?: number }) {
        return this.ordersService.getAll(Number(userId));
    }

    @Get('/:id')
    getOrderById(@Param('id') id: number, @Query() {userId}: { userId?: number }) {
        return this.ordersService.getById(Number(id), Number(userId));
    }

    @Put('/:id')
    editOrder(@Param('id') id: number, @Body() body: Order): any {
        return this.ordersService.update(body);
    }

    @Patch('/:id')
    async patchOrder(@Param('id') id: number, @Body() body: Order) {
        const item = await this.ordersService.getById(Number(id), Number(body.userId));

        Object.assign(item, body);

        return this.ordersService.update(item);
    }

    @Post('')
    addOrder(@Body() body: Order) {
        return this.ordersService.create(body);
    }
}

import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {OrdersService} from "../orders/orders.service";
import {OrderStatus} from "@prisma/client";
import {AuthGuard} from "@nestjs/passport";

@UseGuards(AuthGuard('jwt'))
@Controller('/api/executor')
export class ExecutorController {

    constructor(private readonly ordersService: OrdersService) {
    }

    @Get('/orders')
    getOrders(@Req() req) {
        return this.ordersService.getAllByExecutor(req.user.id).then(r => r.map(o => ({
            ...o,
            status: o.date > new Date() ? o.status : OrderStatus.completed
        })));
    }
}

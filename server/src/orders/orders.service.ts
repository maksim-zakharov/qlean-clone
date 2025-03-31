import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {Order} from "@prisma/client";

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) {
    }

    getById(id: Order['id'], userId: Order['userId']) {
        return this.prisma.order.findUnique({
            where: {id, userId}
        })
    }

    getAll(userId: Order['userId']) {
        return this.prisma.order.findMany({
            where: {userId}
        })
    }

    async create(data: Omit<Order, 'id'>): Promise<Order> {
        return this.prisma.order.create({
            data,
        });
    }

    async update(data: Order): Promise<Order> {
        return this.prisma.order.update({
            data,
            where: {id: data.id, userId: data.userId},
        });
    }

    async delete(id: Order['id']): Promise<Order> {
        return this.prisma.order.delete({
            where: {id},
        });
    }
}

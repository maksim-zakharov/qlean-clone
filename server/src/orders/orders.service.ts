import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {Order, OrderStatus} from "@prisma/client";

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) {
    }

    async getById(id: Order['id'], userId: Order['userId']) {
        const order = await this.prisma.order.findUnique({
            where: {id, userId},
            include: {
                baseService: true,
                options: true,
                serviceVariant: true,
            },
        })

        return {
            ...order,
            status: order.date > new Date() ? order.status : OrderStatus.completed
        }
    }

    getAll(userId: Order['userId']) {
        return this.prisma.order.findMany({
            where: {userId},
            include: {
                baseService: true,
                options: true,
                serviceVariant: true,
            }
        })
    }

    async create(data: any): Promise<Order> {
        try {
            return this.prisma.order.create({
                data: {
                    baseServiceId: data.baseService.id,
                    userId: data.userId,
                    date: new Date(data.date),
                    fullAddress: data.fullAddress,
                    serviceVariantId: data.serviceVariant.id,
                    comment: data.comment,
                    options: {
                        connect: data.options.map(({id}) => ({id}))
                    }
                },
                include: {
                    options: true // Чтобы получить связанные опции в ответе
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to create order');
        }
    }

    async update(data: any): Promise<Order> {
        try {
            return this.prisma.order.update({
                where: {id: data.id, userId: data.userId},
                data: {
                    baseServiceId: data.baseService.id,
                    userId: data.userId,
                    date: new Date(data.date),
                    fullAddress: data.fullAddress,
                    serviceVariantId: data.serviceVariant.id,
                    comment: data.comment,
                    options: {
                        connect: data.options.map(({id}) => ({id}))
                    }
                },
                include: {
                    options: true // Чтобы получить связанные опции в ответе
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to update order');
        }
    }

    async delete(id: Order['id']): Promise<Order> {
        try {
            return this.prisma.order.delete({
                where: {id},
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete order');
        }
    }
}

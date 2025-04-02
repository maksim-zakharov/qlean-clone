import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {Order} from "@prisma/client";

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) {
    }

    getById(id: Order['id'], userId: Order['userId']) {
        return this.prisma.order.findUnique({
            where: {id, userId},
            include: {
                baseService: true,
                options: true,
                serviceVariant: true,
            }
        })
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
        return this.prisma.order.create({
            data: {
                baseServiceId: data.baseService.id,
                userId: data.userId,
                date: new Date(data.date),
                fullAddress: data.fullAddress,
                serviceVariantId: data.serviceVariant.id,
                optionIds: data.options.map(o => o.id)
            },
        });
    }

    async update(data: any): Promise<Order> {
        return this.prisma.order.update({
            data: {
                baseServiceId: data.baseService.id,
                userId: data.userId,
                date: new Date(data.date),
                fullAddress: data.fullAddress,
                serviceVariantId: data.serviceVariant.id,
                optionIds: data.options.map(o => o.id)
            },
            where: {id: data.id, userId: data.userId},
        });
    }

    async delete(id: Order['id']): Promise<Order> {
        return this.prisma.order.delete({
            where: {id},
        });
    }
}

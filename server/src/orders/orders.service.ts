import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Order, OrderStatus, User } from '@prisma/client';
import { BusinessException } from '../common/exceptions/business.exception';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private validateOrderDate(date: Date) {
    const now = new Date();
    if (date < now) {
      throw new BusinessException(
        'INVALID_ORDER_DATE',
        'Дата заказа не может быть в прошлом',
      );
    }
  }

  async getById(id: Order['id'], userId: Order['userId']) {
    const order = await this.prisma.order.findUnique({
      where: { id, userId },
      include: {
        baseService: true,
        options: true,
        serviceVariant: true,
        executor: true,
      },
    });

    order.status =
      order.date > new Date() ? order.status : OrderStatus.completed;

    return order;
  }

  getAll(userId: Order['userId']) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        baseService: true,
        options: true,
        serviceVariant: true,
      },
    });
  }

  getAllByExecutor(executorId: Order['executorId']) {
    return this.prisma.order.findMany({
      // where: {executorId}, // TODO потом вернуть
      include: {
        baseService: true,
        options: true,
        serviceVariant: true,
      },
    });
  }

  async create(data: CreateOrderDto & { userId: User['id'] }): Promise<Order> {
    // Проверка что дата заказа позже текущего времени
    this.validateOrderDate(data.date);
    try {
      return this.prisma.order.create({
        data: {
          baseServiceId: data.baseService.id,
          userId: data.userId,
          date: new Date(data.date),
          fullAddress: data.fullAddress,
          serviceVariantId: data.serviceVariant.id,
          options: {
            connect: data.options?.map(({ id }) => ({ id })) || [],
          },
        },
        include: {
          options: true,
          baseService: true,
          serviceVariant: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  async update(data: any): Promise<Order> {
    // Проверка что дата заказа позже текущего времени
    this.validateOrderDate(data.date);
    try {
      return this.prisma.order.update({
        where: { id: data.id, userId: data.userId },
        data: {
          startedAt: data.startedAt,
          completedAt: data.completedAt,
          baseServiceId: data.baseService.id,
          executorId: data.executorId,
          status: data.status,
          userId: data.userId,
          date: new Date(data.date),
          fullAddress: data.fullAddress,
          serviceVariantId: data.serviceVariant.id,
          comment: data.comment,
          options: {
            set: data.options.map(({ id }) => ({ id })),
          },
        },
        include: {
          options: true, // Чтобы получить связанные опции в ответе
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update order');
    }
  }

  async delete(id: Order['id']): Promise<Order> {
    try {
      return this.prisma.order.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete order');
    }
  }
}

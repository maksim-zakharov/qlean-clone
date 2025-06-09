import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BaseService, ServiceOption } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  getById(id: BaseService['id']) {
    return this.prisma.baseService.findUnique({
      where: { id },
      include: {
        options: true,
        variants: true,
      },
    });
  }

  getVariantById(id: BaseService['id']) {
    return this.prisma.serviceVariant.findUnique({
      where: { id },
      include: {
        baseService: true,
        variants: true,
      },
    });
  }

  getVariants() {
    return this.prisma.serviceVariant.findMany({
      include: {
        baseService: true,
      },
    });
  }

  getAll() {
    return this.prisma.baseService.findMany({
      include: {
        options: true,
        variants: true,
      },
    });
  }

  async create(
    data: BaseService & { options: ServiceOption[] },
  ): Promise<BaseService> {
    return this.prisma.baseService.create({
      data: {
        name: data.name,
        options: {
          create: data.options.map(({ id, ...o }) => o),
        },
      },
      include: {
        options: true,
      },
    });
  }

  async update(data: BaseService): Promise<BaseService> {
    return this.prisma.baseService.update({
      data,
      where: { id: data.id },
    });
  }

  async delete(id: BaseService['id']): Promise<BaseService> {
    return this.prisma.baseService.delete({
      where: { id },
    });
  }
}

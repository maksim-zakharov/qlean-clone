import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {BaseService} from "@prisma/client";

@Injectable()
export class ServicesService {
    constructor(private prisma: PrismaService) {
    }

    getById(id: BaseService['id']) {
        return this.prisma.baseService.findUnique({
            where: {id}
        })
    }

    getAll() {
        return this.prisma.baseService.findMany({
            include: {
                options: true,
                variants: true
            }
        })
    }

    async create(data: Omit<BaseService, 'id'>): Promise<BaseService> {
        return this.prisma.baseService.create({
            data,
        });
    }

    async update(data: BaseService): Promise<BaseService> {
        return this.prisma.baseService.update({
            data,
            where: {id: data.id},
        });
    }

    async delete(id: BaseService['id']): Promise<BaseService> {
        return this.prisma.baseService.delete({
            where: {id},
        });
    }
}

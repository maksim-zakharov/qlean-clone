import {Injectable} from '@nestjs/common';
import {PrismaService} from './prisma.service';
import {Address} from '@prisma/client';

@Injectable()
export class AddressesService {
    constructor(private prisma: PrismaService) {
    }

    getById(id: Address['id'], userId: Address['userId']) {
        return this.prisma.address.findUnique({
            where: {id, userId}
        })
    }

    getAll(userId: Address['userId']) {
        return this.prisma.address.findMany({
            where: {userId}
        })
    }

    async create(data: Omit<Address, 'id'>): Promise<Address> {
        return this.prisma.address.create({
            data,
        });
    }

    async update(data: Address): Promise<Address> {
        return this.prisma.address.update({
            data,
            where: {id: data.id, userId: data.userId},
        });
    }

    async delete(id: Address['id']): Promise<Address> {
        return this.prisma.address.delete({
            where: {id},
        });
    }
}

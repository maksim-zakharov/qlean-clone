import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {User} from "@prisma/client";
import {PrismaService} from "../prisma.service";

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) {
    }

    async getById(id: User['id']) {
        return  this.prisma.user.findUnique({
            where: {id}
        })
    }

    async create(data: any): Promise<User> {
        try {
            return this.prisma.user.create({
                data: {
                    id: data.id,
                    firstName: data.first_name,
                    role: 'client',
                    lastName: data.last_name,
                    photoUrl: data.photo_url,
                    username: data.username,
                }
            });
        } catch (error) {
            throw new InternalServerErrorException('Failed to create user');
        }
    }
}

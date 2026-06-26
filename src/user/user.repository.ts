import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../services/prisma.service';
import { CreateUserDto } from './dtos';

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(accountId: string, data: CreateUserDto & { slug: string }) {
        const id = uuidv4();
        return this.prisma.user.create({
            data: {
                id,
                account_id: accountId,
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                slug: data.slug,
            },
        });
    }

    async findByAccountId(accountId: string) {
        return this.prisma.user.findUnique({
            where: { account_id: accountId },
        });
    }

    async slugExists(slug: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { slug },
            select: { id: true },
        });
        return user !== null;
    }
}

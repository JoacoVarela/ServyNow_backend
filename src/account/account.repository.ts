import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateAccountDto } from './dtos/create-account.dto';
import { account_role } from '@prisma/client';

@Injectable()
export class AccountRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Pick<CreateAccountDto, 'email' | 'password'> & { role: account_role }) {
        const id = uuidv4();

        try {
            return await this.prisma.account.create({
                data: { id, email: data.email, password: data.password, role: data.role },
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictException('Email already exists');
            }
            throw error;
        }
    }

    async findByEmail(email: string) {
        const account = await this.prisma.account.findUnique({ where: { email } });
        if (!account) throw new NotFoundException('Account not found');
        return account;
    }

    async findByEmailOrNull(email: string) {
        return this.prisma.account.findUnique({ where: { email } });
    }

    async findByIdOrNull(id: string) {
        return this.prisma.account.findUnique({ where: { id } });
    }

    async setRefreshTokenHash(accountId: string, refreshTokenHash: string | null) {
        return this.prisma.account.update({
            where: { id: accountId },
            data: { refreshTokenHash },
        });
    }
}
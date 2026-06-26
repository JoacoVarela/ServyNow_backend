import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreatePaymentDto } from './dtos/create-payment.dto';

@Injectable()
export class PaymentsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(accountId: string, data: CreatePaymentDto) {
        return this.prisma.payment.create({
            data: {
                id: uuidv4(),
                accountId,
                amount: data.amount,
                currency: 'UYU',
                method: data.method ?? 'CARD',
                subscriptionId: data.subscriptionId ?? null,
                externalReference: data.externalReference ?? null,
                status: 'PENDING',
            },
        });
    }

    async confirm(paymentId: string, externalReference?: string) {
        const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
        if (!payment) throw new NotFoundException('Pago no encontrado');

        return this.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: 'COMPLETED',
                externalReference: externalReference ?? payment.externalReference,
            },
        });
    }

    async getMyPayments(accountId: string) {
        return this.prisma.payment.findMany({
            where: { accountId },
            include: { subscription: { include: { plan: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getEarningsSummary(professionalAccountId: string) {
        const professional = await this.prisma.professional.findUnique({
            where: { account_id: professionalAccountId },
        });
        if (!professional) return { total: 0, thisMonth: 0, payments: [] };

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [all, thisMonth] = await Promise.all([
            this.prisma.payment.findMany({
                where: { accountId: professionalAccountId, status: 'COMPLETED' },
                orderBy: { createdAt: 'desc' },
                take: 12,
            }),
            this.prisma.payment.aggregate({
                where: {
                    accountId: professionalAccountId,
                    status: 'COMPLETED',
                    createdAt: { gte: startOfMonth },
                },
                _sum: { amount: true },
            }),
        ]);

        const total = all.reduce((sum, p) => sum + p.amount, 0);

        return {
            total,
            thisMonth: thisMonth._sum.amount ?? 0,
            payments: all,
        };
    }
}

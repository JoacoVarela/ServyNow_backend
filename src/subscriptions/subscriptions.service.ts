import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { SubscribeDto } from './dtos/subscribe.dto';

@Injectable()
export class SubscriptionsService {
    constructor(private readonly prisma: PrismaService) {}

    async listPlans() {
        return this.prisma.subscription_plan.findMany({ orderBy: { price: 'asc' } });
    }

    async createPlan(data: CreatePlanDto) {
        return this.prisma.subscription_plan.create({
            data: {
                id: uuidv4(),
                name: data.name,
                description: data.description,
                price: data.price,
                maxContactsPerMonth: data.maxContactsPerMonth ?? null,
                isFeatured: data.isFeatured ?? false,
                hasAdvancedStats: data.hasAdvancedStats ?? false,
            },
        });
    }

    async subscribe(professionalAccountId: string, data: SubscribeDto) {
        const professional = await this.prisma.professional.findUnique({ where: { account_id: professionalAccountId } });
        if (!professional) throw new NotFoundException('Perfil profesional no encontrado');

        const plan = await this.prisma.subscription_plan.findUnique({ where: { id: data.planId } });
        if (!plan) throw new NotFoundException('Plan no encontrado');

        const active = await this.prisma.subscription.findFirst({
            where: { professionalId: professional.id, status: 'ACTIVE' },
        });
        if (active) throw new ConflictException('Ya tienes una suscripción activa. Cancelá la actual primero');

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        return this.prisma.subscription.create({
            data: {
                id: uuidv4(),
                professionalId: professional.id,
                planId: plan.id,
                startDate,
                endDate,
            },
            include: { plan: true },
        });
    }

    async getMySubscription(professionalAccountId: string) {
        const professional = await this.prisma.professional.findUnique({ where: { account_id: professionalAccountId } });
        if (!professional) return null;

        return this.prisma.subscription.findFirst({
            where: { professionalId: professional.id, status: 'ACTIVE' },
            include: { plan: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async cancel(professionalAccountId: string) {
        const professional = await this.prisma.professional.findUnique({ where: { account_id: professionalAccountId } });
        if (!professional) throw new NotFoundException('Perfil profesional no encontrado');

        const sub = await this.prisma.subscription.findFirst({
            where: { professionalId: professional.id, status: 'ACTIVE' },
        });
        if (!sub) throw new BadRequestException('No tienes una suscripción activa');

        return this.prisma.subscription.update({ where: { id: sub.id }, data: { status: 'CANCELED' } });
    }
}

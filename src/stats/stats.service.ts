import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class StatsService {
    constructor(private readonly prisma: PrismaService) {}

    async getProfessionalStats(professionalAccountId: string) {
        const professional = await this.prisma.professional.findUnique({
            where: { account_id: professionalAccountId },
        });
        if (!professional) throw new NotFoundException('Perfil profesional no encontrado');

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const last30days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [
            jobStats,
            reviewStats,
            appointmentsThisMonth,
            quoteOffersStats,
            subscription,
        ] = await Promise.all([
            this.prisma.service_job.groupBy({
                by: ['status'],
                where: { professionalId: professional.id },
                _count: true,
            }),
            this.prisma.review.aggregate({
                where: { professionalId: professional.id, status: 'VISIBLE' },
                _count: true,
                _avg: { rating: true },
            }),
            this.prisma.appointment.count({
                where: { professionalId: professional.id, createdAt: { gte: startOfMonth } },
            }),
            this.prisma.quote_offer.groupBy({
                by: ['status'],
                where: { professionalId: professional.id },
                _count: true,
            }),
            this.prisma.subscription.findFirst({
                where: { professionalId: professional.id, status: 'ACTIVE' },
                include: { plan: true },
            }),
        ]);

        const jobsByStatus = Object.fromEntries(jobStats.map(s => [s.status, s._count]));
        const offersByStatus = Object.fromEntries(quoteOffersStats.map(s => [s.status, s._count]));
        const totalJobs = Object.values(jobsByStatus).reduce((a: any, b: any) => a + b, 0);
        const acceptedOffers = offersByStatus['ACCEPTED'] ?? 0;
        const totalOffers = Object.values(offersByStatus).reduce((a: any, b: any) => a + b, 0);

        return {
            profileViews: professional.profileViews,
            contactCount: professional.contactCount,
            rating: professional.rating,
            reviewCount: reviewStats._count,
            avgRating: reviewStats._avg.rating ?? 0,
            jobs: {
                total: totalJobs,
                byStatus: jobsByStatus,
            },
            quoteOffers: {
                total: totalOffers,
                accepted: acceptedOffers,
                conversionRate: totalOffers > 0 ? Math.round((acceptedOffers / totalOffers) * 100) : 0,
            },
            appointmentsThisMonth,
            subscription: subscription
                ? { plan: subscription.plan.name, endDate: subscription.endDate }
                : null,
            last30daysSummary: {
                period: `${last30days.toLocaleDateString('es-UY')} - ${now.toLocaleDateString('es-UY')}`,
            },
        };
    }
}

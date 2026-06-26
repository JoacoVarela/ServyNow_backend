import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) {}

    // ── Professionals ──────────────────────────────────────────────

    async listProfessionals(filters: {
        verificationStatus?: string;
        status?: string;
        page?: number;
        pageSize?: number;
    }) {
        const page = filters.page ?? 1;
        const pageSize = filters.pageSize ?? 20;
        const where: any = {
            ...(filters.verificationStatus ? { verificationStatus: filters.verificationStatus } : {}),
            ...(filters.status ? { status: filters.status } : {}),
        };

        const [items, total] = await Promise.all([
            this.prisma.professional.findMany({
                where,
                include: { categories: { include: { category: true } } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.prisma.professional.count({ where }),
        ]);

        return { items, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
    }

    async verifyProfessional(id: string, status: 'VERIFIED' | 'REJECTED') {
        const professional = await this.prisma.professional.findUnique({ where: { id } });
        if (!professional) throw new NotFoundException('Profesional no encontrado');

        return this.prisma.professional.update({ where: { id }, data: { verificationStatus: status } });
    }

    async blockProfessional(id: string) {
        return this.prisma.professional.update({ where: { id }, data: { status: 'BLOCKED' } });
    }

    // ── Accounts ───────────────────────────────────────────────────

    async listAccounts(filters: { role?: string; page?: number; pageSize?: number }) {
        const page = filters.page ?? 1;
        const pageSize = filters.pageSize ?? 20;
        const where: any = { ...(filters.role ? { role: filters.role } : {}) };

        const [items, total] = await Promise.all([
            this.prisma.account.findMany({
                where,
                select: { id: true, email: true, role: true, createdAt: true },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.prisma.account.count({ where }),
        ]);

        return { items, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
    }

    async deleteAccount(id: string) {
        const account = await this.prisma.account.findUnique({ where: { id } });
        if (!account) throw new NotFoundException('Cuenta no encontrada');

        return this.prisma.account.delete({ where: { id } });
    }

    // ── Review Reports ─────────────────────────────────────────────

    async listReviewReports(filters: { status?: string; page?: number; pageSize?: number }) {
        const page = filters.page ?? 1;
        const pageSize = filters.pageSize ?? 20;
        const where: any = { ...(filters.status ? { status: filters.status } : { status: 'OPEN' }) };

        const [items, total] = await Promise.all([
            this.prisma.review_report.findMany({
                where,
                include: { review: { select: { id: true, comment: true, rating: true, professionalId: true } } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.prisma.review_report.count({ where }),
        ]);

        return { items, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
    }

    async resolveReport(id: string, action: 'RESOLVED' | 'DISMISSED') {
        const report = await this.prisma.review_report.findUnique({ where: { id } });
        if (!report) throw new NotFoundException('Reporte no encontrado');

        if (action === 'RESOLVED') {
            await this.prisma.review.update({ where: { id: report.reviewId }, data: { status: 'HIDDEN' } });
        }

        return this.prisma.review_report.update({ where: { id }, data: { status: action } });
    }

    // ── Plans ──────────────────────────────────────────────────────

    async createPlan(data: { name: string; description?: string; price: number; isFeatured?: boolean; hasAdvancedStats?: boolean; maxContactsPerMonth?: number }) {
        const { v4: uuidv4 } = await import('uuid');
        return this.prisma.subscription_plan.create({
            data: { id: uuidv4(), ...data, price: data.price },
        });
    }

    // ── Dashboard stats ────────────────────────────────────────────

    async getDashboard() {
        const [
            totalAccounts,
            totalProfessionals,
            pendingVerifications,
            openReports,
            totalJobs,
            openQuoteRequests,
        ] = await Promise.all([
            this.prisma.account.count(),
            this.prisma.professional.count(),
            this.prisma.professional.count({ where: { verificationStatus: 'PENDING' } }),
            this.prisma.review_report.count({ where: { status: 'OPEN' } }),
            this.prisma.service_job.count(),
            this.prisma.quote_request.count({ where: { status: 'OPEN' } }),
        ]);

        return { totalAccounts, totalProfessionals, pendingVerifications, openReports, totalJobs, openQuoteRequests };
    }
}

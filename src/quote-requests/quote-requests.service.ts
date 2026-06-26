import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateQuoteRequestDto } from './dtos/create-quote-request.dto';
import { CreateQuoteOfferDto } from './dtos/create-quote-offer.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class QuoteRequestsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationsService: NotificationsService,
    ) {}

    async create(clientAccountId: string, data: CreateQuoteRequestDto) {
        const request = await this.prisma.quote_request.create({
            data: {
                id: uuidv4(),
                clientAccountId,
                title: data.title,
                description: data.description,
                city: data.city,
                budget: data.budget,
                categoryId: data.categoryId ?? null,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            },
            include: { category: true },
        });
        return request;
    }

    async findAll(filters: { city?: string; categoryId?: string; status?: string; page?: number; pageSize?: number }) {
        const page = filters.page ?? 1;
        const pageSize = filters.pageSize ?? 10;

        const where: any = {
            ...(filters.city ? { city: { contains: filters.city } } : {}),
            ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
            ...(filters.status ? { status: filters.status } : { status: 'OPEN' }),
        };

        const [items, total] = await Promise.all([
            this.prisma.quote_request.findMany({
                where,
                include: { category: true, offers: { select: { id: true } } },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.prisma.quote_request.count({ where }),
        ]);

        return { items, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
    }

    async findMineAsClient(clientAccountId: string) {
        return this.prisma.quote_request.findMany({
            where: { clientAccountId },
            include: {
                category: true,
                offers: {
                    include: {
                        professional: {
                            select: { id: true, firstName: true, lastName: true, avatarUrl: true, rating: true, slug: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: string) {
        const request = await this.prisma.quote_request.findUnique({
            where: { id },
            include: {
                category: true,
                offers: {
                    where: { status: { not: 'REJECTED' } },
                    include: {
                        professional: {
                            select: { id: true, firstName: true, lastName: true, avatarUrl: true, rating: true, slug: true },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!request) throw new NotFoundException('Solicitud no encontrada');
        return request;
    }

    async sendOffer(quoteRequestId: string, professionalAccountId: string, data: CreateQuoteOfferDto) {
        const request = await this.prisma.quote_request.findUnique({ where: { id: quoteRequestId } });
        if (!request) throw new NotFoundException('Solicitud no encontrada');
        if (request.status !== 'OPEN') throw new BadRequestException('Esta solicitud ya no está abierta');

        const professional = await this.prisma.professional.findUnique({
            where: { account_id: professionalAccountId },
        });
        if (!professional) throw new NotFoundException('Perfil profesional no encontrado');

        try {
            const offer = await this.prisma.quote_offer.create({
                data: {
                    id: uuidv4(),
                    quoteRequestId,
                    professionalId: professional.id,
                    price: data.price,
                    description: data.description,
                    estimatedDays: data.estimatedDays,
                },
            });

            await this.notificationsService.create(
                request.clientAccountId,
                'QUOTE_RECEIVED',
                'Nuevo presupuesto recibido',
                `${professional.firstName} ${professional.lastName} envió un presupuesto para "${request.title}"`,
                { quoteRequestId, offerId: offer.id },
            );

            return offer;
        } catch (error: any) {
            if (error.code === 'P2002') throw new ConflictException('Ya enviaste un presupuesto para esta solicitud');
            throw error;
        }
    }

    async acceptOffer(quoteRequestId: string, offerId: string, clientAccountId: string) {
        const request = await this.prisma.quote_request.findUnique({
            where: { id: quoteRequestId },
            include: { offers: { where: { id: offerId } } },
        });
        if (!request) throw new NotFoundException('Solicitud no encontrada');
        if (request.clientAccountId !== clientAccountId) throw new ForbiddenException('No autorizado');
        if (request.status !== 'OPEN') throw new BadRequestException('Esta solicitud ya no está abierta');

        const offer = request.offers[0];
        if (!offer) throw new NotFoundException('Oferta no encontrada');

        await this.prisma.$transaction([
            this.prisma.quote_offer.update({ where: { id: offerId }, data: { status: 'ACCEPTED' } }),
            this.prisma.quote_offer.updateMany({
                where: { quoteRequestId, id: { not: offerId } },
                data: { status: 'REJECTED' },
            }),
            this.prisma.quote_request.update({ where: { id: quoteRequestId }, data: { status: 'ASSIGNED' } }),
        ]);

        const professional = await this.prisma.professional.findUnique({ where: { id: offer.professionalId } });
        if (professional) {
            await this.notificationsService.create(
                professional.account_id,
                'QUOTE_ACCEPTED',
                'Presupuesto aceptado',
                `Tu presupuesto para "${request.title}" fue aceptado`,
                { quoteRequestId, offerId },
            );
        }

        return { success: true };
    }

    async closeRequest(id: string, clientAccountId: string) {
        const request = await this.prisma.quote_request.findUnique({ where: { id } });
        if (!request) throw new NotFoundException('Solicitud no encontrada');
        if (request.clientAccountId !== clientAccountId) throw new ForbiddenException('No autorizado');

        return this.prisma.quote_request.update({ where: { id }, data: { status: 'CLOSED' } });
    }
}

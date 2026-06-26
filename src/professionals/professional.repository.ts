import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../services/prisma.service';
import { CreateProfessionalDto, UpdateProfessionalDto } from './dtos';
import { SearchProfessionalsDto } from './dtos/search-professionals.dto';
import slugify from 'slugify';
import { ReviewModerationAction } from './dtos/moderate-review.dto';

@Injectable()
export class ProfessionalRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateProfessionalDto & { slug: string; account_id: string }) {
        const id = uuidv4();
        const { categoryIds = [], ...professionalData } = data;

        try {
            return await this.prisma.professional.create({
                data: {
                    id,
                    ...professionalData,
                    firstName: professionalData.firstName!,
                    lastName: professionalData.lastName!,
                    categories: categoryIds.length
                        ? {
                            create: categoryIds.map((categoryId) => ({
                                categoryId,
                            })),
                        }
                        : undefined,
                },
                include: {
                    review: true,
                    categories: { include: { category: true } },
                },
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictException('Professional already exists for this account');
            }
            throw error;
        }
    }

    async findAll(filters: SearchProfessionalsDto) {
        try {
            const page = Math.max(1, Number(filters.page) || 1);
            const pageSize = Math.min(50, Math.max(1, Number(filters.pageSize) || 10));
            const skip = (page - 1) * pageSize;
            
            let sortBy = String(filters.sortBy || 'rating').toLowerCase();
            let sortDirection = String(filters.sortDirection || 'desc').toLowerCase();

            // Validate sortBy
            const validSortFields = ['rating', 'minprice', 'createdat'];
            sortBy = validSortFields.includes(sortBy) ? sortBy : 'rating';
            
            // Map to actual field names (case-sensitive for Prisma)
            const sortByMap: Record<string, string> = {
                'rating': 'rating',
                'minprice': 'minPrice',
                'createdat': 'createdAt',
            };
            sortBy = sortByMap[sortBy];
            sortDirection = sortDirection === 'asc' ? 'asc' : 'desc';

            const where: any = {
                isProfilePublic: true,
                status: 'ACTIVE',
            };

            if (filters.search) {
                where.OR = [
                    { firstName: { contains: filters.search } },
                    { lastName: { contains: filters.search } },
                    { bio: { contains: filters.search } },
                ];
            }

            if (filters.city) {
                where.city = { contains: filters.city };
            }

            if (filters.minPrice !== undefined) {
                where.minPrice = { gte: Number(filters.minPrice) || 0 };
            }

            if (filters.maxPrice !== undefined) {
                where.maxPrice = { lte: Number(filters.maxPrice) || 999999 };
            }

            if (filters.minRating !== undefined) {
                where.rating = { gte: Number(filters.minRating) || 0 };
            }

            if (filters.availability) {
                where.availability = filters.availability;
            }

            if (filters.status) {
                where.status = filters.status;
            }

            if (filters.verificationStatus) {
                where.verificationStatus = filters.verificationStatus;
            }

            if (filters.categoryId) {
                where.categories = {
                    some: { categoryId: filters.categoryId },
                };
            }

            const orderByObj: any = {};
            orderByObj[sortBy] = sortDirection;

            const [items, total] = await Promise.all([
                this.prisma.professional.findMany({
                    where,
                    include: {
                        review: { where: { status: 'VISIBLE' } },
                        categories: { include: { category: true } },
                    },
                    orderBy: orderByObj,
                    skip,
                    take: pageSize,
                }),
                this.prisma.professional.count({ where }),
            ]);

            return {
                items,
                pagination: {
                    page,
                    pageSize,
                    total,
                    totalPages: Math.ceil(total / pageSize),
                },
            };
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }

    async findBySlug(slug: string) {
        const professional = await this.prisma.professional.findUnique({
            where: { slug },
            include: {
                review: { where: { status: 'VISIBLE' } },
                categories: { include: { category: true } },
            },
        });

        if (!professional) {
            throw new NotFoundException('Professional not found');
        }
        return professional;
    }

    async findByAccountId(accountId: string) {
        return this.prisma.professional.findUnique({
            where: { account_id: accountId },
            include: {
                review: true,
                categories: { include: { category: true } },
            },
        });
    }

    async findByIdOrNull(id: string) {
        return this.prisma.professional.findUnique({ where: { id } });
    }

    async findAccountById(accountId: string) {
        return this.prisma.account.findUnique({
            where: { id: accountId },
            select: { id: true, email: true, role: true, createdAt: true },
        });
    }

    async update(id: string, data: UpdateProfessionalDto) {
        const existing = await this.prisma.professional.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('Professional not found');
        }

        const { categoryIds, ...updateData } = data as UpdateProfessionalDto & { categoryIds?: string[] };

        return this.prisma.professional.update({
            where: { id },
            data: {
                ...updateData,
                ...(categoryIds
                    ? {
                        categories: {
                            deleteMany: {},
                            create: categoryIds.map((categoryId) => ({ categoryId })),
                        },
                    }
                    : {}),
            },
            include: {
                review: true,
                categories: { include: { category: true } },
            },
        });
    }

    async delete(id: string) {
        const existing = await this.prisma.professional.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException('Professional not found');
        }

        return this.prisma.professional.delete({ where: { id } });
    }

    async slugExists(slug: string): Promise<boolean> {
        const count = await this.prisma.professional.count({ where: { slug } });
        return count > 0;
    }

    async createCategory(name: string) {
        const slug = slugify(name, { lower: true, strict: true });
        return this.prisma.category.create({
            data: {
                id: uuidv4(),
                name,
                slug,
            },
        });
    }

    async listCategories() {
        return this.prisma.category.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async getCompletedJobAvailableForReview(clientAccountId: string, professionalId: string) {
        return this.prisma.service_job.findFirst({
            where: {
                clientAccountId,
                professionalId,
                status: 'COMPLETED',
                review: null,
            },
            orderBy: { completedAt: 'desc' },
        });
    }

    async createReviewFromCompletedJob(params: {
        professionalId: string;
        reviewerAccountId: string;
        serviceJobId: string;
        reviewerName: string;
        rating: number;
        comment?: string;
    }) {
        const newReview = await this.prisma.review.create({
            data: {
                id: uuidv4(),
                professionalId: params.professionalId,
                reviewerAccountId: params.reviewerAccountId,
                serviceJobId: params.serviceJobId,
                reviewerName: params.reviewerName,
                rating: params.rating,
                comment: params.comment,
            },
        });

        await this.recalculateProfessionalRating(params.professionalId);
        return newReview;
    }

    async recalculateProfessionalRating(professionalId: string) {
        const aggregate = await this.prisma.review.aggregate({
            where: {
                professionalId,
                status: 'VISIBLE',
            },
            _avg: { rating: true },
        });

        const rating = aggregate._avg.rating ?? 0;
        await this.prisma.professional.update({
            where: { id: professionalId },
            data: { rating },
        });
    }

    async reportReview(reviewId: string, reporterAccountId: string, reason: string) {
        const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
        if (!review) {
            throw new NotFoundException('Review not found');
        }

        try {
            return await this.prisma.review_report.create({
                data: {
                    id: uuidv4(),
                    reviewId,
                    reporterAccountId,
                    reason,
                },
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictException('You already reported this review');
            }
            throw error;
        }
    }

    async moderateReview(reviewId: string, action: ReviewModerationAction, professionalAccountId: string) {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId },
            include: { professional: true },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.professional.account_id !== professionalAccountId) {
            throw new ConflictException('You can only moderate reviews from your own profile');
        }

        const status = action === ReviewModerationAction.HIDE ? 'HIDDEN' : 'VISIBLE';
        const updated = await this.prisma.review.update({
            where: { id: reviewId },
            data: { status },
        });

        await this.recalculateProfessionalRating(review.professionalId);
        return updated;
    }

    async listReportsForProfessional(professionalAccountId: string) {
        const professional = await this.prisma.professional.findUnique({ where: { account_id: professionalAccountId } });
        if (!professional) {
            return [];
        }

        return this.prisma.review_report.findMany({
            where: {
                review: {
                    professionalId: professional.id,
                },
            },
            include: { review: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    // ── Photos ────────────────────────────────────────────────────

    async addPhoto(professionalId: string, url: string, dto: { caption?: string; type?: string }) {
        return this.prisma.professional_photo.create({
            data: {
                id: uuidv4(),
                professionalId,
                url,
                caption: dto.caption,
                type: (dto.type as any) ?? 'PORTFOLIO',
            },
        });
    }

    async deletePhoto(professionalId: string, photoId: string) {
        const photo = await this.prisma.professional_photo.findUnique({ where: { id: photoId } });
        if (!photo || photo.professionalId !== professionalId) {
            throw new NotFoundException('Foto no encontrada');
        }
        return this.prisma.professional_photo.delete({ where: { id: photoId } });
    }

    // ── Certifications ────────────────────────────────────────────

    async addCertification(professionalId: string, data: { title: string; issuer?: string; issuedAt?: string; expiresAt?: string; documentUrl?: string }) {
        return this.prisma.professional_certification.create({
            data: {
                id: uuidv4(),
                professionalId,
                title: data.title,
                issuer: data.issuer,
                issuedAt: data.issuedAt ? new Date(data.issuedAt) : null,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
                documentUrl: data.documentUrl,
            },
        });
    }

    async deleteCertification(professionalId: string, certId: string) {
        const cert = await this.prisma.professional_certification.findUnique({ where: { id: certId } });
        if (!cert || cert.professionalId !== professionalId) {
            throw new NotFoundException('Certificación no encontrada');
        }
        return this.prisma.professional_certification.delete({ where: { id: certId } });
    }

    // ── Services ──────────────────────────────────────────────────

    async addService(professionalId: string, data: { name: string; description?: string; price?: number; durationMinutes?: number }) {
        return this.prisma.professional_service.create({
            data: { id: uuidv4(), professionalId, ...data },
        });
    }

    async deleteService(professionalId: string, serviceId: string) {
        const service = await this.prisma.professional_service.findUnique({ where: { id: serviceId } });
        if (!service || service.professionalId !== professionalId) {
            throw new NotFoundException('Servicio no encontrado');
        }
        return this.prisma.professional_service.delete({ where: { id: serviceId } });
    }

    // ── Schedule ──────────────────────────────────────────────────

    async setSchedule(professionalId: string, days: Array<{ dayOfWeek: string; startTime: string; endTime: string; isAvailable?: boolean }>) {
        return this.prisma.$transaction(
            days.map(day =>
                this.prisma.professional_schedule.upsert({
                    where: {
                        professionalId_dayOfWeek: {
                            professionalId,
                            dayOfWeek: Number(day.dayOfWeek),
                        },
                    },
                    create: {
                        id: uuidv4(),
                        professionalId,
                        dayOfWeek: Number(day.dayOfWeek),
                        startTime: day.startTime,
                        endTime: day.endTime,
                        isAvailable: day.isAvailable ?? true,
                    },
                    update: {
                        startTime: day.startTime,
                        endTime: day.endTime,
                        isAvailable: day.isAvailable ?? true,
                    },
                }),
            ),
        );
    }

    async getSchedule(professionalId: string) {
        return this.prisma.professional_schedule.findMany({
            where: { professionalId },
            orderBy: { dayOfWeek: 'asc' },
        });
    }

    // ── Profile views ─────────────────────────────────────────────

    async incrementProfileViews(slug: string) {
        return this.prisma.professional.updateMany({
            where: { slug },
            data: { profileViews: { increment: 1 } },
        });
    }
}
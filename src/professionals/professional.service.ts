import { Injectable, ConflictException, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import slugify from 'slugify';
import { ProfessionalRepository } from './professional.repository';
import { CreateProfessionalDto } from './dtos/create-professional.dto';
import { UpdateProfessionalDto } from './dtos/update-professional.dto';
import { CreateReviewDto } from './dtos/create-review.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { SearchProfessionalsDto } from './dtos/search-professionals.dto';
import { UserRepository } from 'src/user/user.repository';
import { ModerateReviewDto } from './dtos/moderate-review.dto';
import { ReportReviewDto } from './dtos/report-review.dto';
import { AddPhotoDto } from './dtos/add-photo.dto';
import { AddCertificationDto } from './dtos/add-certification.dto';
import { AddServiceDto } from './dtos/add-service.dto';
import { SetScheduleDto } from './dtos/set-schedule.dto';
import { UploadsService } from 'src/uploads/uploads.service';

@Injectable()
export class ProfessionalService {
    constructor(
        private readonly professionalRepository: ProfessionalRepository,
        private readonly userRepository: UserRepository,
        private readonly uploadsService: UploadsService,
    ) { }

    private toPublicProfileLink(slug: string) {
        return `/api/professionals/${slug}`;
    }

    async create(data: CreateProfessionalDto, accountId: string) {
        const existing = await this.professionalRepository.findByAccountId(accountId);
        if (existing) {
            throw new ConflictException('Professional profile already exists for this account');
        }

        if (
            data.minPrice !== undefined
            && data.maxPrice !== undefined
            && data.minPrice > data.maxPrice
        ) {
            throw new BadRequestException('minPrice cannot be greater than maxPrice');
        }

        const slug = await this.generateUniqueSlug(data.firstName!, data.lastName!);
        try {
            return await this.professionalRepository.create({ ...data, slug, account_id: accountId });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new ConflictException('Professional with this email already exists');
            }
            throw error;
        }
    }

    async findAll(filters: SearchProfessionalsDto) {
        try {
            const result = await this.professionalRepository.findAll(filters);
            return {
                ...result,
                items: result.items.map((professional) => ({
                    ...professional,
                    profileLink: this.toPublicProfileLink(professional.slug),
                })),
            };
        } catch (error) {
            console.error('Error in findAll service:', error);
            throw error;
        }
    }

    async findBySlug(slug: string) {
        const professional = await this.professionalRepository.findBySlug(slug);
        if (!professional.isProfilePublic) {
            throw new NotFoundException('Professional not found');
        }
        const account = await this.professionalRepository.findAccountById(professional.account_id);

        return {
            ...professional,
            profileLink: this.toPublicProfileLink(professional.slug),
            account,
        };
    }

    async findByAccountId(accountId: string) {
        const professional = await this.professionalRepository.findByAccountId(accountId);
        if (!professional) {
            throw new NotFoundException('Professional profile not found');
        }
        return professional;
    }

    async update(id: string, data: UpdateProfessionalDto, requesterAccountId: string) {
        const professional = await this.professionalRepository.findByIdOrNull(id);
        if (!professional) {
            throw new NotFoundException('Professional not found');
        }
        if (professional.account_id !== requesterAccountId) {
            throw new ForbiddenException('You can only update your own professional profile');
        }

        if (
            data.minPrice !== undefined
            && data.maxPrice !== undefined
            && data.minPrice > data.maxPrice
        ) {
            throw new BadRequestException('minPrice cannot be greater than maxPrice');
        }

        try {
            return await this.professionalRepository.update(id, data);
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Professional not found');
            }
            throw error;
        }
    }

    async delete(id: string, requesterAccountId: string) {
        const professional = await this.professionalRepository.findByIdOrNull(id);
        if (!professional) {
            throw new NotFoundException('Professional not found');
        }
        if (professional.account_id !== requesterAccountId) {
            throw new ForbiddenException('You can only delete your own professional profile');
        }

        try {
            return await this.professionalRepository.delete(id);
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException('Professional not found');
            }
            throw error;
        }
    }

    async addTrustedReview(professionalId: string, clientAccountId: string, data: CreateReviewDto) {
        const professional = await this.professionalRepository.findByIdOrNull(professionalId);
        if (!professional) {
            throw new NotFoundException('Professional not found');
        }

        const completedJob = await this.professionalRepository.getCompletedJobAvailableForReview(
            clientAccountId,
            professionalId,
        );
        if (!completedJob) {
            throw new BadRequestException('You need a completed service with this professional before reviewing');
        }

        const user = await this.userRepository.findByAccountId(clientAccountId);
        const reviewerName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Cliente';

        return this.professionalRepository.createReviewFromCompletedJob({
            professionalId,
            reviewerAccountId: clientAccountId,
            serviceJobId: completedJob.id,
            reviewerName,
            rating: data.rating,
            comment: data.comment,
        });
    }

    async createCategory(data: CreateCategoryDto) {
        return this.professionalRepository.createCategory(data.name);
    }

    async listCategories() {
        return this.professionalRepository.listCategories();
    }

    async reportReview(reviewId: string, reporterAccountId: string, data: ReportReviewDto) {
        const reason = `${data.reason}${data.details ? ` | ${data.details}` : ''}`;
        return this.professionalRepository.reportReview(reviewId, reporterAccountId, reason);
    }

    async moderateReview(reviewId: string, professionalAccountId: string, data: ModerateReviewDto) {
        return this.professionalRepository.moderateReview(reviewId, data.action, professionalAccountId);
    }

    async listMyReviewReports(professionalAccountId: string) {
        return this.professionalRepository.listReportsForProfessional(professionalAccountId);
    }

    // ── Photos ────────────────────────────────────────────────────

    async addPhoto(professionalAccountId: string, file: Express.Multer.File, dto: AddPhotoDto) {
        this.uploadsService.validateImageFile(file);
        const professional = await this.getOwnProfessional(professionalAccountId);
        const url = this.uploadsService.buildPublicUrl('professionals', file.filename);
        return this.professionalRepository.addPhoto(professional.id, url, dto);
    }

    async deletePhoto(professionalAccountId: string, photoId: string) {
        const professional = await this.getOwnProfessional(professionalAccountId);
        return this.professionalRepository.deletePhoto(professional.id, photoId);
    }

    // ── Certifications ────────────────────────────────────────────

    async addCertification(professionalAccountId: string, data: AddCertificationDto) {
        const professional = await this.getOwnProfessional(professionalAccountId);
        return this.professionalRepository.addCertification(professional.id, data);
    }

    async deleteCertification(professionalAccountId: string, certId: string) {
        const professional = await this.getOwnProfessional(professionalAccountId);
        return this.professionalRepository.deleteCertification(professional.id, certId);
    }

    // ── Services ──────────────────────────────────────────────────

    async addService(professionalAccountId: string, data: AddServiceDto) {
        const professional = await this.getOwnProfessional(professionalAccountId);
        return this.professionalRepository.addService(professional.id, data);
    }

    async deleteService(professionalAccountId: string, serviceId: string) {
        const professional = await this.getOwnProfessional(professionalAccountId);
        return this.professionalRepository.deleteService(professional.id, serviceId);
    }

    // ── Schedule ──────────────────────────────────────────────────

    async setSchedule(professionalAccountId: string, data: SetScheduleDto) {
        const professional = await this.getOwnProfessional(professionalAccountId);
        return this.professionalRepository.setSchedule(professional.id, data.schedule);
    }

    async getSchedule(professionalId: string) {
        return this.professionalRepository.getSchedule(professionalId);
    }

    // ── Profile view tracking ─────────────────────────────────────

    async trackProfileView(slug: string) {
        return this.professionalRepository.incrementProfileViews(slug);
    }

    private async getOwnProfessional(accountId: string) {
        const professional = await this.professionalRepository.findByAccountId(accountId);
        if (!professional) throw new NotFoundException('Perfil profesional no encontrado');
        return professional;
    }

    private async generateUniqueSlug(firstName: string, lastName: string): Promise<string> {
        const baseSlug = slugify(`${firstName}-${lastName}`, { lower: true });
        let slug = baseSlug;
        let counter = 1;

        while (await this.professionalRepository.slugExists(slug)) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        return slug;
    }
}
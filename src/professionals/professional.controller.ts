import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfessionalService } from './professional.service';
import { CreateProfessionalDto } from './dtos/create-professional.dto';
import { UpdateProfessionalDto } from './dtos/update-professional.dto';
import { CreateReviewDto } from './dtos/create-review.dto';
import { AccessTokenGuard } from 'src/core/auth/access-token.guard';
import { RolesGuard } from 'src/core/auth/roles.guard';
import { Roles } from 'src/core/auth/roles.decorator';
import { CurrentAccount } from 'src/core/auth/current-account.decorator';
import { SearchProfessionalsDto } from './dtos/search-professionals.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ReportReviewDto } from './dtos/report-review.dto';
import { ModerateReviewDto } from './dtos/moderate-review.dto';
import { AddPhotoDto } from './dtos/add-photo.dto';
import { AddCertificationDto } from './dtos/add-certification.dto';
import { AddServiceDto } from './dtos/add-service.dto';
import { SetScheduleDto } from './dtos/set-schedule.dto';
import { UploadsService } from 'src/uploads/uploads.service';

@Controller('professionals')
export class ProfessionalController {
    constructor(
        private readonly professionalService: ProfessionalService,
        private readonly uploadsService: UploadsService,
    ) { }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Post()
    async create(
        @Body() data: CreateProfessionalDto,
        @CurrentAccount('sub') accountId: string,
    ) {
        return this.professionalService.create(data, accountId);
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Get('me')
    async getMyProfile(@CurrentAccount('sub') accountId: string) {
        return this.professionalService.findByAccountId(accountId);
    }

    @Get()
    async findAll(@Query() filters: SearchProfessionalsDto) {
        return this.professionalService.findAll(filters);
    }

    @Get('categories')
    async listCategories() {
        return this.professionalService.listCategories();
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Post('categories')
    async createCategory(@Body() data: CreateCategoryDto) {
        return this.professionalService.createCategory(data);
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() data: UpdateProfessionalDto,
        @CurrentAccount('sub') accountId: string,
    ) {
        return this.professionalService.update(id, data, accountId);
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Delete(':id')
    async delete(
        @Param('id') id: string,
        @CurrentAccount('sub') accountId: string,
    ) {
        return this.professionalService.delete(id, accountId);
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('CLIENT')
    @Post(':id/reviews')
    async addReview(
        @Param('id') id: string,
        @Body() data: CreateReviewDto,
        @CurrentAccount('sub') accountId: string,
    ) {
        return this.professionalService.addTrustedReview(id, accountId, data);
    }

    @UseGuards(AccessTokenGuard)
    @Post('reviews/:reviewId/reports')
    async reportReview(
        @Param('reviewId') reviewId: string,
        @CurrentAccount('sub') accountId: string,
        @Body() data: ReportReviewDto,
    ) {
        return this.professionalService.reportReview(reviewId, accountId, data);
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Patch('reviews/:reviewId/moderation')
    async moderateReview(
        @Param('reviewId') reviewId: string,
        @CurrentAccount('sub') accountId: string,
        @Body() data: ModerateReviewDto,
    ) {
        return this.professionalService.moderateReview(reviewId, accountId, data);
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Get('reviews/reports/my')
    async listMyReviewReports(@CurrentAccount('sub') accountId: string) {
        return this.professionalService.listMyReviewReports(accountId);
    }

    // ── Schedule ──────────────────────────────────────────────────

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Put('schedule')
    async setSchedule(@CurrentAccount('sub') accountId: string, @Body() data: SetScheduleDto) {
        return this.professionalService.setSchedule(accountId, data);
    }

    @Get(':id/schedule')
    async getSchedule(@Param('id') id: string) {
        return this.professionalService.getSchedule(id);
    }

    // ── Photos ────────────────────────────────────────────────────

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Post('photos')
    @UseInterceptors(FileInterceptor('file', {
        storage: (() => {
            const { diskStorage } = require('multer');
            const { join } = require('path');
            const { mkdirSync, existsSync } = require('fs');
            const dest = join(process.cwd(), 'public', 'uploads', 'professionals');
            if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
            return diskStorage({
                destination: (_req: any, _file: any, cb: any) => cb(null, dest),
                filename: (_req: any, file: any, cb: any) => {
                    const ext = file.originalname.split('.').pop();
                    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`);
                },
            });
        })(),
    }))
    async addPhoto(
        @CurrentAccount('sub') accountId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: AddPhotoDto,
    ) {
        return this.professionalService.addPhoto(accountId, file, dto);
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Delete('photos/:photoId')
    async deletePhoto(@CurrentAccount('sub') accountId: string, @Param('photoId') photoId: string) {
        return this.professionalService.deletePhoto(accountId, photoId);
    }

    // ── Certifications ────────────────────────────────────────────

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Post('certifications')
    async addCertification(@CurrentAccount('sub') accountId: string, @Body() data: AddCertificationDto) {
        return this.professionalService.addCertification(accountId, data);
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Delete('certifications/:certId')
    async deleteCertification(@CurrentAccount('sub') accountId: string, @Param('certId') certId: string) {
        return this.professionalService.deleteCertification(accountId, certId);
    }

    // ── Services ──────────────────────────────────────────────────

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Post('services')
    async addService(@CurrentAccount('sub') accountId: string, @Body() data: AddServiceDto) {
        return this.professionalService.addService(accountId, data);
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Delete('services/:serviceId')
    async deleteService(@CurrentAccount('sub') accountId: string, @Param('serviceId') serviceId: string) {
        return this.professionalService.deleteService(accountId, serviceId);
    }

    // ── Public profile (tracks view) ─────────────────────────────

    @Get(':slug')
    async findBySlug(@Param('slug') slug: string) {
        await this.professionalService.trackProfileView(slug);
        return this.professionalService.findBySlug(slug);
    }
}
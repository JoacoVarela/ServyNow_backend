import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AccessTokenGuard } from 'src/core/auth/access-token.guard';
import { RolesGuard } from 'src/core/auth/roles.guard';
import { Roles } from 'src/core/auth/roles.decorator';

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('dashboard')
    getDashboard() {
        return this.adminService.getDashboard();
    }

    // ── Professionals ──────────────────────────────────────────────

    @Get('professionals')
    listProfessionals(
        @Query('verificationStatus') verificationStatus?: string,
        @Query('status') status?: string,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
    ) {
        return this.adminService.listProfessionals({ verificationStatus, status, page, pageSize });
    }

    @Patch('professionals/:id/verify')
    verifyProfessional(@Param('id') id: string, @Query('status') status: 'VERIFIED' | 'REJECTED') {
        return this.adminService.verifyProfessional(id, status);
    }

    @Patch('professionals/:id/block')
    blockProfessional(@Param('id') id: string) {
        return this.adminService.blockProfessional(id);
    }

    // ── Accounts ───────────────────────────────────────────────────

    @Get('accounts')
    listAccounts(
        @Query('role') role?: string,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
    ) {
        return this.adminService.listAccounts({ role, page, pageSize });
    }

    @Delete('accounts/:id')
    deleteAccount(@Param('id') id: string) {
        return this.adminService.deleteAccount(id);
    }

    // ── Review Reports ─────────────────────────────────────────────

    @Get('review-reports')
    listReviewReports(
        @Query('status') status?: string,
        @Query('page') page?: number,
        @Query('pageSize') pageSize?: number,
    ) {
        return this.adminService.listReviewReports({ status, page, pageSize });
    }

    @Patch('review-reports/:id/resolve')
    resolveReport(@Param('id') id: string, @Query('action') action: 'RESOLVED' | 'DISMISSED') {
        return this.adminService.resolveReport(id, action);
    }

    // ── Dashboard ──────────────────────────────────────────────────

    @Post('plans')
    createPlan(@Body() data: any) {
        return this.adminService.createPlan(data);
    }
}

import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { AccessTokenGuard } from 'src/core/auth/access-token.guard';
import { RolesGuard } from 'src/core/auth/roles.guard';
import { Roles } from 'src/core/auth/roles.decorator';
import { CurrentAccount } from 'src/core/auth/current-account.decorator';
import { CreateJobDto } from './dtos/create-job.dto';
import { UpdateJobStatusDto } from './dtos/update-job-status.dto';

@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Roles('CLIENT')
  @Post()
  async create(@CurrentAccount('sub') accountId: string, @Body() data: CreateJobDto) {
    return this.jobsService.create(accountId, data);
  }

  @Roles('CLIENT', 'PROFESSIONAL')
  @Get('my')
  async listMine(
    @CurrentAccount('sub') accountId: string,
    @CurrentAccount('role') role: 'CLIENT' | 'PROFESSIONAL',
  ) {
    return this.jobsService.listMine(accountId, role);
  }

  @Roles('PROFESSIONAL')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @CurrentAccount('sub') accountId: string,
    @Body() data: UpdateJobStatusDto,
  ) {
    return this.jobsService.updateStatus(id, accountId, data);
  }

  @Roles('CLIENT')
  @Patch(':id/cancel')
  async cancelByClient(@Param('id') id: string, @CurrentAccount('sub') accountId: string) {
    return this.jobsService.cancelByClient(id, accountId);
  }
}

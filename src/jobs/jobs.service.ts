import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateJobDto } from './dtos/create-job.dto';
import { UpdateJobStatus, UpdateJobStatusDto } from './dtos/update-job-status.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(clientAccountId: string, data: CreateJobDto) {
    const professional = await this.prisma.professional.findUnique({
      where: { id: data.professionalId },
    });
    if (!professional) {
      throw new NotFoundException('Professional not found');
    }
    if (professional.status !== 'ACTIVE') {
      throw new BadRequestException('Professional is not available to receive jobs');
    }

    return this.prisma.service_job.create({
      data: {
        id: uuidv4(),
        clientAccountId,
        professionalId: data.professionalId,
        title: data.title,
        description: data.description,
        address: data.address,
        budget: data.budget,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      },
      include: {
        professional: true,
      },
    });
  }

  async listMine(accountId: string, role: 'CLIENT' | 'PROFESSIONAL') {
    if (role === 'PROFESSIONAL') {
      const professional = await this.prisma.professional.findUnique({ where: { account_id: accountId } });
      if (!professional) {
        return [];
      }
      return this.prisma.service_job.findMany({
        where: { professionalId: professional.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.service_job.findMany({
      where: { clientAccountId: accountId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(jobId: string, professionalAccountId: string, data: UpdateJobStatusDto) {
    const job = await this.prisma.service_job.findUnique({
      where: { id: jobId },
      include: { professional: true },
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.professional.account_id !== professionalAccountId) {
      throw new ForbiddenException('You can only update your own jobs');
    }

    if (!this.canTransition(job.status, data.status)) {
      throw new BadRequestException(`Invalid status transition from ${job.status} to ${data.status}`);
    }

    return this.prisma.service_job.update({
      where: { id: jobId },
      data: {
        status: data.status,
        completedAt: data.status === 'COMPLETED' ? new Date() : job.completedAt,
      },
    });
  }

  async cancelByClient(jobId: string, clientAccountId: string) {
    const job = await this.prisma.service_job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.clientAccountId !== clientAccountId) {
      throw new ForbiddenException('You can only cancel your own jobs');
    }

    if (!['PENDING', 'ACCEPTED'].includes(job.status)) {
      throw new BadRequestException('Only pending or accepted jobs can be canceled by client');
    }

    return this.prisma.service_job.update({
      where: { id: jobId },
      data: { status: 'CANCELED' },
    });
  }

  private canTransition(current: string, next: UpdateJobStatus) {
    const transitions: Record<string, string[]> = {
      PENDING: [UpdateJobStatus.ACCEPTED, UpdateJobStatus.CANCELED],
      ACCEPTED: [UpdateJobStatus.IN_PROGRESS, UpdateJobStatus.CANCELED],
      IN_PROGRESS: [UpdateJobStatus.COMPLETED, UpdateJobStatus.CANCELED],
      COMPLETED: [],
      CANCELED: [],
    };

    return transitions[current]?.includes(next as string) ?? false;
  }
}

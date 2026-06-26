import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { RescheduleAppointmentDto } from './dtos/reschedule-appointment.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class AppointmentsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationsService: NotificationsService,
    ) {}

    async create(clientAccountId: string, data: CreateAppointmentDto) {
        const professional = await this.prisma.professional.findUnique({
            where: { id: data.professionalId },
        });
        if (!professional) throw new NotFoundException('Profesional no encontrado');
        if (professional.status !== 'ACTIVE') throw new BadRequestException('El profesional no está disponible');

        const scheduledDate = new Date(data.scheduledAt);
        if (scheduledDate <= new Date()) throw new BadRequestException('La fecha debe ser futura');

        const appointment = await this.prisma.appointment.create({
            data: {
                id: uuidv4(),
                clientAccountId,
                professionalId: data.professionalId,
                scheduledAt: scheduledDate,
                durationMinutes: data.durationMinutes ?? 60,
                address: data.address,
                notes: data.notes,
                serviceJobId: data.serviceJobId ?? null,
            },
            include: { professional: { select: { firstName: true, lastName: true, avatarUrl: true, slug: true } } },
        });

        await this.notificationsService.create(
            professional.account_id,
            'APPOINTMENT_SCHEDULED',
            'Nueva cita solicitada',
            `Tienes una nueva solicitud de cita para el ${scheduledDate.toLocaleDateString('es-UY')}`,
            { appointmentId: appointment.id },
        );

        return appointment;
    }

    async findMine(accountId: string, role: 'CLIENT' | 'PROFESSIONAL') {
        if (role === 'PROFESSIONAL') {
            const professional = await this.prisma.professional.findUnique({ where: { account_id: accountId } });
            if (!professional) return [];

            return this.prisma.appointment.findMany({
                where: { professionalId: professional.id },
                orderBy: { scheduledAt: 'asc' },
            });
        }

        return this.prisma.appointment.findMany({
            where: { clientAccountId: accountId },
            include: { professional: { select: { firstName: true, lastName: true, avatarUrl: true, slug: true } } },
            orderBy: { scheduledAt: 'asc' },
        });
    }

    async confirm(id: string, professionalAccountId: string) {
        const appt = await this.findAppointmentForProfessional(id, professionalAccountId);
        if (appt.status !== 'PENDING') throw new BadRequestException('Solo se pueden confirmar citas pendientes');

        const updated = await this.prisma.appointment.update({
            where: { id },
            data: { status: 'CONFIRMED' },
        });

        await this.notificationsService.create(
            appt.clientAccountId,
            'APPOINTMENT_SCHEDULED',
            'Cita confirmada',
            `Tu cita para el ${appt.scheduledAt.toLocaleDateString('es-UY')} fue confirmada`,
            { appointmentId: id },
        );

        return updated;
    }

    async reschedule(id: string, accountId: string, data: RescheduleAppointmentDto) {
        const appt = await this.prisma.appointment.findUnique({ where: { id } });
        if (!appt) throw new NotFoundException('Cita no encontrada');

        const isClient = appt.clientAccountId === accountId;
        const professional = await this.prisma.professional.findUnique({ where: { account_id: accountId } });
        const isProfessional = professional?.id === appt.professionalId;

        if (!isClient && !isProfessional) throw new ForbiddenException('No autorizado');
        if (!['PENDING', 'CONFIRMED'].includes(appt.status)) {
            throw new BadRequestException('No se puede reagendar esta cita');
        }

        const newDate = new Date(data.scheduledAt);
        if (newDate <= new Date()) throw new BadRequestException('La nueva fecha debe ser futura');

        return this.prisma.appointment.update({
            where: { id },
            data: { scheduledAt: newDate, notes: data.notes ?? appt.notes, status: 'RESCHEDULED' },
        });
    }

    async cancel(id: string, accountId: string) {
        const appt = await this.prisma.appointment.findUnique({ where: { id } });
        if (!appt) throw new NotFoundException('Cita no encontrada');

        const isClient = appt.clientAccountId === accountId;
        const professional = await this.prisma.professional.findUnique({ where: { account_id: accountId } });
        const isProfessional = professional?.id === appt.professionalId;

        if (!isClient && !isProfessional) throw new ForbiddenException('No autorizado');
        if (['COMPLETED', 'CANCELED'].includes(appt.status)) {
            throw new BadRequestException('No se puede cancelar esta cita');
        }

        return this.prisma.appointment.update({ where: { id }, data: { status: 'CANCELED' } });
    }

    private async findAppointmentForProfessional(id: string, professionalAccountId: string) {
        const professional = await this.prisma.professional.findUnique({ where: { account_id: professionalAccountId } });
        const appt = await this.prisma.appointment.findUnique({ where: { id } });
        if (!appt) throw new NotFoundException('Cita no encontrada');
        if (appt.professionalId !== professional?.id) throw new ForbiddenException('No autorizado');
        return appt;
    }
}

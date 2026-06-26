import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { RescheduleAppointmentDto } from './dtos/reschedule-appointment.dto';
import { AccessTokenGuard } from 'src/core/auth/access-token.guard';
import { RolesGuard } from 'src/core/auth/roles.guard';
import { Roles } from 'src/core/auth/roles.decorator';
import { CurrentAccount } from 'src/core/auth/current-account.decorator';

@UseGuards(AccessTokenGuard)
@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) {}

    @UseGuards(RolesGuard)
    @Roles('CLIENT')
    @Post()
    create(@CurrentAccount('sub') accountId: string, @Body() data: CreateAppointmentDto) {
        return this.appointmentsService.create(accountId, data);
    }

    @Get('my')
    findMine(
        @CurrentAccount('sub') accountId: string,
        @CurrentAccount('role') role: 'CLIENT' | 'PROFESSIONAL',
    ) {
        return this.appointmentsService.findMine(accountId, role);
    }

    @UseGuards(RolesGuard)
    @Roles('PROFESSIONAL')
    @Patch(':id/confirm')
    confirm(@Param('id') id: string, @CurrentAccount('sub') accountId: string) {
        return this.appointmentsService.confirm(id, accountId);
    }

    @Patch(':id/reschedule')
    reschedule(
        @Param('id') id: string,
        @CurrentAccount('sub') accountId: string,
        @Body() data: RescheduleAppointmentDto,
    ) {
        return this.appointmentsService.reschedule(id, accountId, data);
    }

    @Patch(':id/cancel')
    cancel(@Param('id') id: string, @CurrentAccount('sub') accountId: string) {
        return this.appointmentsService.cancel(id, accountId);
    }
}

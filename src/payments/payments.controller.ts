import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { AccessTokenGuard } from 'src/core/auth/access-token.guard';
import { RolesGuard } from 'src/core/auth/roles.guard';
import { Roles } from 'src/core/auth/roles.decorator';
import { CurrentAccount } from 'src/core/auth/current-account.decorator';

@UseGuards(AccessTokenGuard)
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post()
    create(@CurrentAccount('sub') accountId: string, @Body() data: CreatePaymentDto) {
        return this.paymentsService.create(accountId, data);
    }

    @Get('my')
    getMyPayments(@CurrentAccount('sub') accountId: string) {
        return this.paymentsService.getMyPayments(accountId);
    }

    @UseGuards(RolesGuard)
    @Roles('PROFESSIONAL')
    @Get('earnings')
    getEarnings(@CurrentAccount('sub') accountId: string) {
        return this.paymentsService.getEarningsSummary(accountId);
    }

    // Webhook de pasarela de pago (sin auth, usa firma externa)
    @Patch(':id/confirm')
    confirm(@Param('id') id: string) {
        return this.paymentsService.confirm(id);
    }
}

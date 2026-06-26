import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscribeDto } from './dtos/subscribe.dto';
import { AccessTokenGuard } from 'src/core/auth/access-token.guard';
import { RolesGuard } from 'src/core/auth/roles.guard';
import { Roles } from 'src/core/auth/roles.decorator';
import { CurrentAccount } from 'src/core/auth/current-account.decorator';

@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {}

    @Get('plans')
    listPlans() {
        return this.subscriptionsService.listPlans();
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Post('subscribe')
    subscribe(@CurrentAccount('sub') accountId: string, @Body() data: SubscribeDto) {
        return this.subscriptionsService.subscribe(accountId, data);
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Get('my')
    getMySubscription(@CurrentAccount('sub') accountId: string) {
        return this.subscriptionsService.getMySubscription(accountId);
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @Delete('cancel')
    cancel(@CurrentAccount('sub') accountId: string) {
        return this.subscriptionsService.cancel(accountId);
    }
}

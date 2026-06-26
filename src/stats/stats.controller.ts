import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AccessTokenGuard } from 'src/core/auth/access-token.guard';
import { RolesGuard } from 'src/core/auth/roles.guard';
import { Roles } from 'src/core/auth/roles.decorator';
import { CurrentAccount } from 'src/core/auth/current-account.decorator';

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles('PROFESSIONAL')
@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) {}

    @Get()
    getMyStats(@CurrentAccount('sub') accountId: string) {
        return this.statsService.getProfessionalStats(accountId);
    }
}

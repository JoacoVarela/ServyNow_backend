import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AccessTokenGuard } from 'src/core/auth/access-token.guard';
import { CurrentAccount } from 'src/core/auth/current-account.decorator';

@UseGuards(AccessTokenGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get()
    findMine(
        @CurrentAccount('sub') accountId: string,
        @Query('unread') unread?: string,
    ) {
        return this.notificationsService.findMine(accountId, unread === 'true');
    }

    @Get('unread-count')
    countUnread(@CurrentAccount('sub') accountId: string) {
        return this.notificationsService.countUnread(accountId).then(count => ({ count }));
    }

    @Patch(':id/read')
    markRead(@Param('id') id: string, @CurrentAccount('sub') accountId: string) {
        return this.notificationsService.markRead(id, accountId);
    }

    @Patch('read-all')
    markAllRead(@CurrentAccount('sub') accountId: string) {
        return this.notificationsService.markAllRead(accountId);
    }
}

import { Module } from '@nestjs/common';
import { QuoteRequestsService } from './quote-requests.service';
import { QuoteRequestsController } from './quote-requests.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule, NotificationsModule],
    controllers: [QuoteRequestsController],
    providers: [QuoteRequestsService],
})
export class QuoteRequestsModule {}

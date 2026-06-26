import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule, NotificationsModule],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule {}

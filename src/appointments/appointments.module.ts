import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule, NotificationsModule],
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
})
export class AppointmentsModule {}

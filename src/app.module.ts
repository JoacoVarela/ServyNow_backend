import { Module } from '@nestjs/common';
import { PrismaModule } from './services/prisma.module';
import { ProfessionalsModule } from './professionals/professional.module';
import { AccountModule } from './account/account.module';
import { JobsModule } from './jobs/jobs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { QuoteRequestsModule } from './quote-requests/quote-requests.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ChatModule } from './chat/chat.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';
import { StatsModule } from './stats/stats.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    PrismaModule,
    UploadsModule,
    AccountModule,
    ProfessionalsModule,
    JobsModule,
    NotificationsModule,
    QuoteRequestsModule,
    AppointmentsModule,
    ChatModule,
    SubscriptionsModule,
    PaymentsModule,
    AdminModule,
    StatsModule,
  ],
})
export class AppModule { }
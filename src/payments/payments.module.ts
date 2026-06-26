import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule],
    controllers: [PaymentsController],
    providers: [PaymentsService],
})
export class PaymentsModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from './services/prisma.module';
import { ProfessionalsModule } from './professionals/professionals.module';

@Module({
  imports: [
    PrismaModule,
    ProfessionalsModule,
  ],
})
export class AppModule { }
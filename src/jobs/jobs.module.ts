import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from 'src/core/auth/access-token.guard';
import { RolesGuard } from 'src/core/auth/roles.guard';

@Module({
  imports: [JwtModule],
  controllers: [JobsController],
  providers: [JobsService, AccessTokenGuard, RolesGuard],
})
export class JobsModule {}

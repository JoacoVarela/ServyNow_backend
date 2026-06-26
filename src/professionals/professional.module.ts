import { Module } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { ProfessionalController } from './professional.controller';
import { ProfessionalRepository } from './professional.repository';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from 'src/core/auth/access-token.guard';
import { RolesGuard } from 'src/core/auth/roles.guard';
import { UserRepository } from 'src/user/user.repository';
import { UploadsModule } from 'src/uploads/uploads.module';

@Module({
    controllers: [ProfessionalController],
    imports: [JwtModule, UploadsModule],
    providers: [ProfessionalService, ProfessionalRepository, AccessTokenGuard, RolesGuard, UserRepository],
    exports: [ProfessionalRepository],
})
export class ProfessionalsModule { }
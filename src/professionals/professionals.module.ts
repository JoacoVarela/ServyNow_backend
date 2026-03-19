import { Module } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { ProfessionalController } from './professional.controller';
import { ProfessionalRepository } from './professional.repository';

@Module({
    controllers: [ProfessionalController],
    providers: [ProfessionalService, ProfessionalRepository],
})
export class ProfessionalsModule { }
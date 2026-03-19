import {
    Injectable,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { ProfessionalRepository } from './professional.repository';
import { CreateProfessionalDto, UpdateProfessionalDto } from './dtos';

@Injectable()
export class ProfessionalService {
    constructor(private repo: ProfessionalRepository) { }

    async create(data: CreateProfessionalDto) {
        try {
            return await this.repo.create(data);
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Email already exists');
            }

            throw new InternalServerErrorException();
        }
    }

    findAll() {
        return this.repo.findAll();
    }

    async findById(id: string) {
        const prof = await this.repo.findById(id);
        if (!prof) {
            throw new NotFoundException('Professional not found');
        }
        return prof;
    }

    async update(id: string, data: UpdateProfessionalDto) {
        try {
            return await this.repo.update(id, data);
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Email already exists');
            }
            throw new InternalServerErrorException();
        }
    }

    async delete(id: string) {
        try {
            await this.repo.delete(id);
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}
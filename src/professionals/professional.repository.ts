import { v4 as uuidv4 } from 'uuid';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { CreateProfessionalDto, UpdateProfessionalDto } from './dtos';


@Injectable()
export class ProfessionalRepository {
    constructor(private prisma: PrismaService) { }

    create(data: CreateProfessionalDto) {
        return this.prisma.professional.create({
            data: {
                id: uuidv4(),
                ...data,
            },
        });
    }

    findAll() {
        return this.prisma.professional.findMany({
            include: { review: true },
        });
    }

    findById(id: string) {
        return this.prisma.professional.findUnique({
            where: { id },
            include: { review: true },
        });
    }

    update(id: string, data: UpdateProfessionalDto) {
        return this.prisma.professional.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        await this.prisma.professional.delete({
            where: { id },
        });
    }
}
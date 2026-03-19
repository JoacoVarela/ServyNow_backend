import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { CreateProfessionalDto, UpdateProfessionalDto } from './dtos';

@Controller('professionals')
export class ProfessionalController {
    constructor(private service: ProfessionalService) { }

    @Post()
    create(@Body() data: CreateProfessionalDto) {
        return this.service.create(data);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.service.findById(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() data: UpdateProfessionalDto,
    ) {
        return this.service.update(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(id);
    }
}
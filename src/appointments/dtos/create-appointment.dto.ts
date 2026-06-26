import { IsDateString, IsInt, IsOptional, IsString, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
    @IsString()
    professionalId!: string;

    @IsDateString()
    scheduledAt!: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(15)
    durationMinutes?: number;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    address?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    notes?: string;

    @IsOptional()
    @IsString()
    serviceJobId?: string;
}

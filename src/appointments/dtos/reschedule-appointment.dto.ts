import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class RescheduleAppointmentDto {
    @IsDateString()
    scheduledAt!: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    notes?: string;
}

import { IsArray, IsBoolean, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ScheduleDayDto {
    @IsString()
    @Matches(/^[0-6]$/, { message: 'dayOfWeek debe ser un número entre 0 (domingo) y 6 (sábado)' })
    dayOfWeek!: string;

    @IsString()
    @Matches(/^\d{2}:\d{2}$/)
    startTime!: string;

    @IsString()
    @Matches(/^\d{2}:\d{2}$/)
    endTime!: string;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;
}

export class SetScheduleDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ScheduleDayDto)
    schedule!: ScheduleDayDto[];
}

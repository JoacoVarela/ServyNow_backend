import { IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddServiceDto {
    @IsString()
    @MaxLength(255)
    name!: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(15)
    durationMinutes?: number;
}

import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlanDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name!: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price!: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    maxContactsPerMonth?: number;

    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;

    @IsOptional()
    @IsBoolean()
    hasAdvancedStats?: boolean;
}

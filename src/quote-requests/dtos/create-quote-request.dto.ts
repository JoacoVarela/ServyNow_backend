import { IsString, IsOptional, IsNumber, IsDateString, MaxLength, MinLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuoteRequestDto {
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    title!: string;

    @IsString()
    @MinLength(10)
    @MaxLength(2000)
    description!: string;

    @IsOptional()
    @IsString()
    @MaxLength(120)
    city?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    budget?: number;

    @IsOptional()
    @IsString()
    categoryId?: string;

    @IsOptional()
    @IsDateString()
    expiresAt?: string;
}

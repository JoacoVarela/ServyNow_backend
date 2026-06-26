import { IsNumber, IsOptional, IsString, IsInt, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuoteOfferDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price!: number;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    estimatedDays?: number;
}

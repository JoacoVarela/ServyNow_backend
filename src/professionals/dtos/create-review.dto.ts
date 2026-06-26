import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateReviewDto {
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(5)
    rating!: number;

    @IsOptional()
    @Transform(({ value }) => (value === undefined ? value : String(value).trim()))
    @IsString()
    @MaxLength(1000)
    comment?: string;
}
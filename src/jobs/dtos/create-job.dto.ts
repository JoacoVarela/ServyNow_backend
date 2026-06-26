import { Transform, Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString, Min, MinLength, MaxLength } from 'class-validator';

export class CreateJobDto {
  @IsString()
  professionalId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  @MinLength(5)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}

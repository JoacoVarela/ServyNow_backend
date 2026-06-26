import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class ReportReviewDto {
  @Transform(({ value }) => String(value).trim())
  @IsString()
  @Length(5, 300)
  reason!: string;

  @IsOptional()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  @MaxLength(1000)
  details?: string;
}

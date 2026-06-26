import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ProfessionalAvailability } from './create-professional.dto';

// These enums are for reference; actual validation happens at runtime in the repository
export enum ProfessionalStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  BLOCKED = 'BLOCKED',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum ProfessionalSortBy {
  RATING = 'rating',
  PRICE_MIN = 'minPrice',
  CREATED_AT = 'createdAt',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class SearchProfessionalsDto {
  @IsOptional()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  city?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  minRating?: number;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  verificationStatus?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortDirection?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : Number(value))
  pageSize?: number;
}

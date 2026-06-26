import { Transform } from 'class-transformer';
import {
    ArrayMaxSize,
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Matches,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export enum ProfessionalAvailability {
    AVAILABLE = 'AVAILABLE',
    BUSY = 'BUSY',
    OFFLINE = 'OFFLINE',
}

export class CreateProfessionalDto {
    @IsOptional()
    @Transform(({ value }) => value ? String(value).trim() : undefined)
    @IsString()
    @Length(2, 80)
    firstName?: string;

    @IsOptional()
    @Transform(({ value }) => value ? String(value).trim() : undefined)
    @IsString()
    @Length(2, 80)
    lastName?: string;

    @IsOptional()
    @Transform(({ value }) => String(value).trim())
    @IsString()
    @Matches(/^[+0-9\-()\s]{7,20}$/)
    phoneNumber?: string;

    @IsOptional()
    @Transform(({ value }) => String(value).trim())
    @IsString()
    @MaxLength(800)
    bio?: string;

    @IsOptional()
    @Transform(({ value }) => String(value).trim())
    @IsString()
    @MaxLength(120)
    city?: string;

    @IsOptional()
    @Transform(({ value }) => String(value).trim())
    @IsString()
    @MaxLength(120)
    zone?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(80)
    yearsExperience?: number;

    @IsOptional()
    @IsEnum(ProfessionalAvailability)
    availability?: ProfessionalAvailability;

    @IsOptional()
    @IsBoolean()
    isProfilePublic?: boolean;

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(10)
    @IsString({ each: true })
    categoryIds?: string[];
}
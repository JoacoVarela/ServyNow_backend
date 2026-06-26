import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class AddCertificationDto {
    @IsString()
    @MaxLength(255)
    title!: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    issuer?: string;

    @IsOptional()
    @IsDateString()
    issuedAt?: string;

    @IsOptional()
    @IsDateString()
    expiresAt?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    documentUrl?: string;
}

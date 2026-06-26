import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum PhotoType {
    PORTFOLIO = 'PORTFOLIO',
    BEFORE_AFTER = 'BEFORE_AFTER',
}

export class AddPhotoDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    caption?: string;

    @IsOptional()
    @IsEnum(PhotoType)
    type?: PhotoType;
}

import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateProfessionalDto {
    @IsString() firstName: string;
    @IsString() lastName: string;
    @IsEmail() email: string;
    @IsOptional() @IsString() phoneNumber?: string;
    @IsOptional() @IsString() bio?: string;
}

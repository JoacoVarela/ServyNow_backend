import { IsEmail, IsEnum, IsOptional, IsString, ValidateNested, MinLength, MaxLength } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreateProfessionalDto } from 'src/professionals/dtos';
import { CreateUserDto } from 'src/user/dtos';

export enum AccountRole {
    CLIENT = 'CLIENT',
    USER = 'USER',
    PROFESSIONAL = 'PROFESSIONAL',
}

export class CreateAccountDto {
    @IsOptional()
    @ValidateNested({ each: false })
    @Type(() => CreateProfessionalDto)
    professional?: CreateProfessionalDto;

    @IsOptional()
    @ValidateNested({ each: false })
    @Type(() => CreateUserDto)
    user?: CreateUserDto;

    @Transform(({ value }) => String(value).trim().toLowerCase())
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    @MaxLength(100)
    password!: string;

    @IsEnum(AccountRole)
    role!: AccountRole;
}
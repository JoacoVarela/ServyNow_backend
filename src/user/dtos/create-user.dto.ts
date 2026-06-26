import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MaxLength(255)
    firstName!: string;

    @IsString()
    @MaxLength(255)
    lastName!: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    phoneNumber?: string;
}

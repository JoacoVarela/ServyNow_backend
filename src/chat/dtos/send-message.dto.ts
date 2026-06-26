import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum MessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    LOCATION = 'LOCATION',
}

export class SendMessageDto {
    @IsString()
    @MinLength(1)
    content!: string;

    @IsOptional()
    @IsEnum(MessageType)
    type?: MessageType;
}

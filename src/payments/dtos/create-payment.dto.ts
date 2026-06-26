import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentMethodDto {
    CARD = 'CARD',
    MERCADO_PAGO = 'MERCADO_PAGO',
    TRANSFER = 'TRANSFER',
}

export class CreatePaymentDto {
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    amount!: number;

    @IsOptional()
    @IsEnum(PaymentMethodDto)
    method?: PaymentMethodDto;

    @IsOptional()
    @IsString()
    subscriptionId?: string;

    @IsOptional()
    @IsString()
    externalReference?: string;
}

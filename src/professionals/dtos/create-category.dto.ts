import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @Transform(({ value }) => String(value).trim())
  @IsString()
  @Length(2, 100)
  name!: string;
}

import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  especie!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  raza?: string | null;

  @IsInt()
  @Min(0)
  edad!: number;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsPositive()
  peso!: number;
}

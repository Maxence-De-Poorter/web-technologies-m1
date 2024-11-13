import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @IsOptional()
  @IsNumber()
  @Min(1000)
  @Max(new Date().getFullYear())
  year_published?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;
}

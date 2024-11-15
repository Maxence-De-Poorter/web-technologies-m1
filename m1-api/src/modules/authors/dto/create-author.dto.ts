import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  biography?: string;
}

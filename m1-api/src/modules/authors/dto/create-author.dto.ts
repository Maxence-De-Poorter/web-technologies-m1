import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsUrl()
  photo?: string;

  @IsOptional()
  @IsString()
  biography?: string;
}

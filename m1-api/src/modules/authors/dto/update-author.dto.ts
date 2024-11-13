import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateAuthorDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsUrl()
  photo?: string;

  @IsOptional()
  @IsString()
  biography?: string;
}

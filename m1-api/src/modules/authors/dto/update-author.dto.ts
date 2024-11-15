import { IsString, IsOptional } from 'class-validator';

export class UpdateAuthorDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  biography?: string;
}

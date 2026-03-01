import { IsString, IsOptional } from 'class-validator';

export class SearchTicketsDto {
  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;
}

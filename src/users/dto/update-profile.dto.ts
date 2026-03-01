import { IsString, IsNotEmpty, IsOptional, IsIn, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[6-9]\d{9}$/, { message: 'Enter a valid 10-digit Indian mobile number' })
  mobile: string;

  @IsOptional()
  @IsIn(['anyone', 'buyer'])
  mobileVisible?: string;
}

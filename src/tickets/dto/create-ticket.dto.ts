import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsIn,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PassengerDto {
  @IsString()
  @IsNotEmpty()
  passengerName: string;

  @IsInt()
  @Min(1)
  @Max(120)
  passengerAge: number;

  @IsIn(['M', 'F', 'T'])
  passengerGender: string;

  @IsOptional()
  @IsString()
  seatNumber?: string;
}

export class CreateTicketDto {
  // Train
  @IsString()
  @IsNotEmpty()
  trainNumber: string;

  @IsString()
  @IsNotEmpty()
  trainName: string;

  // Journey
  @IsString()
  @IsNotEmpty()
  fromStation: string;

  @IsString()
  @IsNotEmpty()
  fromStationCode: string;

  @IsString()
  @IsNotEmpty()
  toStation: string;

  @IsString()
  @IsNotEmpty()
  toStationCode: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  journeyDate: string;

  // Booking
  @IsString()
  @IsNotEmpty()
  pnr: string;

  @IsIn(['SL', '3A', '2A', '1A', 'CC', 'EC', '2S', 'FC'])
  travelClass: string;

  @IsIn(['GN', 'TQ', 'LD', 'PH', 'SS', 'HO', 'DF'])
  quota: string;

  // Price
  @IsInt()
  @Min(1)
  price: number;

  // Passengers (1 or more)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PassengerDto)
  passengers: PassengerDto[];
}

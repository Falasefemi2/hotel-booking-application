import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  guestEmail: string;

  @ApiProperty({ example: '2025-10-01' })
  @IsDateString()
  checkInDate: Date;

  @ApiProperty({ example: '2025-10-05' })
  @IsDateString()
  checkOutDate: Date;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  noOfAdults: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  noOfChildren: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  totalNoOfGuests: number;
}

import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewRoomDto {
  @ApiProperty({
    description: 'Room type',
  })
  @IsString()
  roomType: string;

  @ApiProperty({
    description: 'Room price',
  })
  @Type(() => Number)
  @IsNumber()
  roomPrice: number;
}

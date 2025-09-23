import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoomDto {
  @ApiProperty({
    description: 'Room type',
  })
  @IsOptional()
  @IsString()
  roomType?: string;

  @ApiProperty({
    description: 'Room price',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  roomPrice?: number;
}

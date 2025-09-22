import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  roomType?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  roomPrice?: number;
}

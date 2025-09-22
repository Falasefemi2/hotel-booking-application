import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNewRoomDto {
  @IsString()
  roomType: string;

  @Type(() => Number)
  @IsNumber()
  roomPrice: number;
}

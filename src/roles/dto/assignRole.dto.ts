import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({ description: 'User id' })
  @IsInt()
  userId: number;
}

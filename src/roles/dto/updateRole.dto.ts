import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ description: 'Role name' })
  @IsOptional()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsString({ message: 'Role name must be a string' })
  @MinLength(2, { message: 'Role name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Role name cannot exceed 50 characters' })
  name?: string;
}

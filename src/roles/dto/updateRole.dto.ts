import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString({ message: 'Role name must be a string' })
  @IsNotEmpty({ message: 'Role name cannot be empty' })
  @MinLength(2, { message: 'Role name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Role name cannot exceed 50 characters' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  name?: string;
}

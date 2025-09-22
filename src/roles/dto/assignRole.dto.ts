import { IsInt, IsPositive } from 'class-validator';

export class AssignRoleDto {
  // @IsInt({ message: 'User ID must be an integer' })
  // @IsPositive({ message: 'User ID must be a positive number' })
  @IsInt()
  userId: number;
}

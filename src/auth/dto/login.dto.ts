import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
  })
  @IsString()
  password: string;
}

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService, LoginResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Email already exists.' })
  async registerUser(@Body() registerUserDto: RegisterDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('/login')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully logged in.',
  })
  @ApiResponse({ status: 403, description: 'Invalid credentials.' })
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() loginUserDto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(loginUserDto);
  }
}

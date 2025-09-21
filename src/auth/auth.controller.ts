import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService, LoginResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async registerUser(@Body() registerUserDto: RegisterDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async loginUser(@Body() loginUserDto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(loginUserDto);
  }
}

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  access_token: string;
  user: Omit<User, 'password'>;
  expires_in: number;
}

export interface RegisterResponse {
  user: Omit<User, 'password'>;
  message: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.saltRounds = this.configService.get<number>('auth.saltRounds', 12);
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    const { email, password, firstName, lastName } = registerDto;

    try {
      await this.validateEmailAvailability(email);

      const hashedPassword = await this.hashPassword(password);
      const newUser = await this.usersService.createUser({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      this.logger.log(`User registered successfully: ${email}`);

      return {
        user: this.sanitizeUser(newUser),
        message: 'Registration successful',
      };
    } catch (error) {
      if (this.isKnownException(error)) {
        throw error;
      }

      this.logger.error(`Registration failed for email: ${email}`, error.stack);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    try {
      const user = await this.validateUser(email, password);
      const token = await this.generateToken(user);
      const expiresIn = this.getTokenExpirationTime();

      this.logger.log(`User logged in successfully: ${email}`);

      return {
        access_token: token,
        user: this.sanitizeUser(user),
        expires_in: expiresIn,
      };
    } catch (error) {
      if (this.isKnownException(error)) {
        throw error;
      }

      this.logger.error(`Login failed for email: ${email}`, error.stack);
      throw new InternalServerErrorException('Authentication failed');
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      this.logger.warn(`Login attempt with non-existent email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Invalid password attempt for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private async validateEmailAvailability(email: string): Promise<void> {
    const existingUser = await this.usersService.getUserByEmail(email);

    if (existingUser) {
      this.logger.warn(`Registration attempt with existing email: ${email}`);
      throw new ConflictException('Email is already registered');
    }
  }

  private async generateToken(user: any): Promise<string> {
    const payload: JwtPayload = {
      sub: String(user.id),
      email: user.email,
      roles: user.roles?.map((r: any) => r.name) || [],
    };

    return this.jwtService.signAsync(payload);
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      this.logger.error('Password hashing failed', error.stack);
      throw new InternalServerErrorException('Password processing failed');
    }
  }

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      this.logger.error('Password verification failed', error.stack);
      return false;
    }
  }

  private sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  private getTokenExpirationTime(): number {
    return this.configService.get<number>('auth.jwtExpirationTime', 3600);
  }

  private isKnownException(error: any): boolean {
    return (
      error instanceof ConflictException ||
      error instanceof UnauthorizedException
    );
  }
}

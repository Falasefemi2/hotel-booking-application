import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userservice: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('/all')
  async getAllUsers() {
    return await this.userservice.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.userservice.getUserByEmail(email);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'USER')
  @Delete('delete/:email')
  async deleteUser(@Param('email') email: string) {
    try {
      const result = await this.userservice.deleteUser({ email });
      return {
        message: 'User deleted successfully',
        deletedUser: result,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('delete/by-id/:id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userservice.deleteUserById(id);
  }
}

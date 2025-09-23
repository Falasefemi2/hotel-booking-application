import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Roles } from 'src/common/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/roles.guard';
import { CreateRoleDto } from './dto/createRole.dto';
import { Role, User } from '@prisma/client';
import { AssignRoleDto } from './dto/assignRole.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('/all-roles')
  @ApiBearerAuth('access-token')
  async getRoles() {
    return await this.rolesService.getAllRoles();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('/create-role')
  @ApiBearerAuth('access-token')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.createRole(createRoleDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('/delete-role/:id')
  @ApiBearerAuth('access-token')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    return await this.rolesService.deleteRole(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  @ApiBearerAuth('access-token')
  async getRoleById(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    return this.rolesService.getRoleWithUsers(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':roleId/users/:userId')
  @ApiBearerAuth('access-token')
  async removeUserFromRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<User> {
    return this.rolesService.removeUserFromRole(roleId, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':roleId/users')
  @ApiBearerAuth('access-token')
  async removeAllUsersFromRole(
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<Role> {
    return this.rolesService.removeAllUsersFromRole(roleId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':roleId/users')
  @ApiBearerAuth('access-token')
  async getUsersWithRole(
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<User[]> {
    return this.rolesService.getUsersWithRole(roleId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(':roleId/users')
  @ApiBearerAuth('access-token')
  async assignUser(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() dto: AssignRoleDto,
  ) {
    return this.rolesService.assignRoleToUser(roleId, dto.userId);
  }
}

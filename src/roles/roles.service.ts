import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllRoles() {
    return await this.prisma.role.findMany();
  }

  async createRole(data: Prisma.RoleCreateInput): Promise<Role> {
    if (!data.name?.trim()) {
      throw new BadRequestException('Role name is required');
    }
    const existing = await this.findRoleByName(data.name);
    if (existing) {
      throw new ConflictException(`Role "${data.name}" already exists`);
    }
    return this.prisma.role.create({ data });
  }

  async deleteRole(id: number): Promise<Role> {
    if (!id || id <= 0) {
      throw new BadRequestException('Valid role ID is required');
    }

    // check if role exist
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    if (role.users && role.users.length > 0) {
      throw new ConflictException(
        `Cannot delete role "${role.name}" as it has ${role.users.length} assigned user(s)`,
      );
    }
    return await this.prisma.role.delete({ where: { id } });
  }

  async findRoleByName(name: string): Promise<Role | null> {
    if (!name?.trim()) {
      return null;
    }
    return await this.prisma.role.findUnique({ where: { name: name.trim() } });
  }

  async findRoleById(id: number): Promise<Role | null> {
    if (!id || id <= 0) {
      return null;
    }
    return await this.prisma.role.findUnique({ where: { id } });
  }

  async assignRoleToUser(roleId: number, userId: number): Promise<User> {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new NotFoundException('No role found');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });
    if (!user) throw new NotFoundException('No user found');

    if (user.roles.some((r) => r.id === roleId)) {
      throw new ConflictException(`User already has role "${role.name}"`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { roles: { connect: { id: roleId } } },
      include: { roles: true },
    });
  }

  async removeUserFromRole(roleId: number, userId: number): Promise<User> {
    if (!roleId || roleId <= 0) {
      throw new BadRequestException('Valid role ID is required');
    }
    if (!userId || userId <= 0) {
      throw new BadRequestException('Valid user ID is required');
    }

    return await this.prisma.$transaction(async (tx) => {
      const [role, user] = await Promise.all([
        tx.role.findUnique({ where: { id: roleId } }),
        tx.user.findUnique({
          where: { id: userId },
          include: { roles: true },
        }),
      ]);

      if (!role) {
        throw new NotFoundException(`Role with ID ${roleId} not found`);
      }
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      if (!user.roles.some((r) => r.id === roleId)) {
        throw new NotFoundException(`User does not have role "${role.name}"`);
      }

      return tx.user.update({
        where: { id: userId },
        data: { roles: { disconnect: { id: roleId } } },
        include: { roles: true },
      });
    });
  }

  async removeAllUsersFromRole(roleId: number): Promise<Role> {
    if (!roleId || roleId <= 0) {
      throw new BadRequestException('Valid role ID is required');
    }
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return await this.prisma.role.update({
      where: { id: roleId },
      data: { users: { set: [] } },
      include: { users: true },
    });
  }

  async getUsersWithRole(roleId: number): Promise<User[]> {
    if (!roleId || roleId <= 0) {
      throw new BadRequestException('Valid role ID is required');
    }

    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: { users: true },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return role.users;
  }

  async getRoleWithUsers(roleId: number): Promise<Role> {
    if (!roleId || roleId <= 0) {
      throw new BadRequestException('Valid role ID is required');
    }

    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: { users: true },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return role;
  }
}

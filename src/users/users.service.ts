import { Injectable, ConflictException } from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import { PrismaService } from '../prisma.service';

// Type for User with roles included
export type UserWithRoles = User & { roles: Role[] };

// Type for creating a user
export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserData): Promise<UserWithRoles> {
    await this.ensureDefaultRole();

    try {
      return await this.prisma.user.create({
        data: {
          ...data,
          roles: {
            connect: [{ name: 'USER' }],
          },
        },
        include: { roles: true },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByIdWithRoles(id: number): Promise<UserWithRoles | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });
  }
  async getUserByEmailBasic(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });
  }

  async getAllUsersWithRoles(): Promise<UserWithRoles[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        roles: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async updateUserWithRoles(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<UserWithRoles> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
      include: { roles: true },
    });
  }

  async assignRoleToUser(
    userId: number,
    roleName: string,
  ): Promise<UserWithRoles> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          connect: { name: roleName },
        },
      },
      include: { roles: true },
    });
  }

  async removeRoleFromUser(
    userId: number,
    roleName: string,
  ): Promise<UserWithRoles> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          disconnect: { name: roleName },
        },
      },
      include: { roles: true },
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async deleteUserById(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async userExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }

  // Helper method to ensure default role exists
  private async ensureDefaultRole(): Promise<void> {
    await this.prisma.role.upsert({
      where: { name: 'USER' },
      update: {},
      create: { name: 'USER' },
    });
  }

  // Method to create roles (useful for seeding)
  async createRole(name: string): Promise<Role> {
    return this.prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  async getAllRoles(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }
}

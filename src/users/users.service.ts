import { Injectable } from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async getUserWithRoles(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return await this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.prisma.user.delete({
      where,
    });
  }

  async deleteUserById(id: number): Promise<User> {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async getUser(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async getUserByEmail(
    email: string,
  ): Promise<(User & { roles: Role[] }) | null> {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });
  }
}

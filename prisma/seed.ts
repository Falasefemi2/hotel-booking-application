import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Create ADMIN role if it doesn’t exist
  let adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  adminRole ??= await prisma.role.create({ data: { name: 'ADMIN' } });

  // 2. Create an admin user if none
  let adminUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (!adminUser) {
    const hash = await bcrypt.hash('Admin123!', 10);
    adminUser = await prisma.user.create({
      data: {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@example.com',
        password: hash,
        roles: { connect: { id: adminRole.id } },
      },
    });
  }

  console.log('Admin seeded:', adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

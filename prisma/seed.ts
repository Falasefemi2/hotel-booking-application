import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin123@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  const firstName = process.env.ADMIN_FIRSTNAME || 'Super';
  const lastName = process.env.ADMIN_LASTNAME || 'Admin';
  const rolesToEnsure = (process.env.ADMIN_ROLES || 'ADMIN,SUPERADMIN')
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean);
  const roleMap: Record<string, { id: number; name: string }> = {};
  for (const roleName of rolesToEnsure) {
    let role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      role = await prisma.role.create({ data: { name: roleName } });
      console.log(`Created role: ${roleName}`);
    }
    roleMap[roleName] = role;
  }

  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminUser) {
    const hash = await bcrypt.hash(adminPassword, 10);
    adminUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: adminEmail,
        password: hash,
        roles: {
          connect: rolesToEnsure.map((r) => ({ id: roleMap[r].id })),
        },
      },
    });
    console.log(`Created superadmin user: ${adminEmail}`);
  } else {
    const currentRoles = await prisma.user.findUnique({
      where: { email: adminEmail },
      include: { roles: true },
    });
    const currentRoleNames = new Set(currentRoles?.roles.map((r) => r.name));
    const missingRoles = rolesToEnsure.filter((r) => !currentRoleNames.has(r));
    if (missingRoles.length > 0) {
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          roles: { connect: missingRoles.map((r) => ({ id: roleMap[r].id })) },
        },
      });
      console.log(
        `Updated ${adminEmail} with roles: ${missingRoles.join(', ')}`,
      );
    } else {
      console.log(
        `Admin user already exists and has required roles: ${adminEmail}`,
      );
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

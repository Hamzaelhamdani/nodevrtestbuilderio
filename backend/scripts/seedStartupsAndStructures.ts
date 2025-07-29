import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    if (user.role === 'Startup') {
      const existing = await prisma.startup.findFirst({ where: { ownerId: user.id } });
      if (!existing) {
        await prisma.startup.create({
          data: {
            name: user.name,
            ownerId: user.id,
            sector: 'Tech',
            country: 'Morocco',
            website: 'https://venturesroom.com',
            description: `Official profile for ${user.name}`
          }
        });
        console.log(`✅ Startup created for ${user.email}`);
      }
    }

    if (user.role === 'SupportStructure') {
      const existing = await prisma.supportStructure.findFirst({ where: { ownerId: user.id } });
      if (!existing) {
        await prisma.supportStructure.create({
          data: {
            name: user.name,
            ownerId: user.id,
            country: 'Morocco',
            website: 'https://venturesroom.com'
          }
        });
        console.log(`🏗️ Structure created for ${user.email}`);
      }
    }
  }
}

main()
  .then(() => {
    console.log('🌱 Startups & Structures created successfully.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });

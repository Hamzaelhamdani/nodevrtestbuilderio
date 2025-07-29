import { PrismaClient, SupportStructureStatus } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const startups = await prisma.startup.findMany();
  const structures = await prisma.supportStructure.findMany();

  // Round‑robin des startups vers les structures
  let idx = 0;
  for (const startup of startups) {
    const structure = structures[idx % structures.length];

    // Statut aléatoire parmi Pending, Approved, Declined
    const statuses = [
      SupportStructureStatus.Pending,
      SupportStructureStatus.Approved,
      SupportStructureStatus.Declined,
    ];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    await prisma.supportStructureStartup.create({
      data: {
        startupId: startup.id,
        supportStructureId: structure.id,
        status,
      },
    });

    console.log(
      `🔗 Liaison Startup "${startup.name}" → Structure "${structure.name}" [${status}]`
    );
    idx++;
  }
}

main()
  .then(() => {
    console.log('🌱 Support links seeding complete.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });

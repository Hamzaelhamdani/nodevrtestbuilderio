import { PrismaClient, ProductType } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const startups = await prisma.startup.findMany();
  let productCounter = 1;

  for (const startup of startups) {
    for (let i = 0; i < 3; i++) {
      const product = await prisma.product.create({
        data: {
          name: `Product ${productCounter} - ${startup.name}`,
          price: (10 + productCounter * 2),
          type: 'Digital',
          inventory: 100,
          description: `Auto-generated product ${productCounter}`,
          startupId: startup.id,
          image: `https://via.placeholder.com/300?text=Product+${productCounter}`
        }
      });

      console.log(`✅ Created ${product.name}`);

      // Ajouter un discount pour 1 produit sur 3
      if (productCounter % 3 === 0) {
        await prisma.discount.create({
          data: {
            productId: product.id,
            startupId: startup.id,
            percentage: 20,
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 10))
          }
        });
        console.log(`🔻 Discount applied to ${product.name}`);
      }

      productCounter++;
    }
  }
}

main()
  .then(() => {
    console.log('🌱 Products & Discounts seeding complete.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });

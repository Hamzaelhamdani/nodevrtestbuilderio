import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  try {
    console.log('🌱 Seeding products...');

    // Get first startup
    const startup = await prisma.startup.findFirst();
    
    if (!startup) {
      console.log('❌ No startup found. Please create a startup first.');
      return;
    }

    console.log(`✅ Found startup: ${startup.name}`);

    // Create sample products
    const products = [
      {
        name: 'Product 1 - Startup 1',
        description: 'Auto-generated product 1',
        price: 12.00,
        type: 'Physical' as const,
        inventory: 100,
        startupId: startup.id
      },
      {
        name: 'Product 2 - Startup 1', 
        description: 'Auto-generated product 2',
        price: 14.00,
        type: 'Physical' as const,
        inventory: 100,
        startupId: startup.id
      },
      {
        name: 'Product 3 - Startup 1',
        description: 'Auto-generated product 3', 
        price: 16.00,
        type: 'Digital' as const,
        inventory: 100,
        startupId: startup.id
      }
    ];

    for (const productData of products) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          name: productData.name,
          startupId: startup.id
        }
      });

      if (!existingProduct) {
        const product = await prisma.product.create({
          data: productData
        });
        console.log(`✅ Created product: ${product.name} - $${product.price}`);
      } else {
        console.log(`⚠️ Product already exists: ${productData.name}`);
      }
    }

    console.log('🎉 Products seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();

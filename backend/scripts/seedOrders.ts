import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Mélange aléatoirement un tableau.
 */
function shuffle<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

async function main() {
  // 1. Récupérer tous les clients
  const clients = await prisma.user.findMany({
    where: { role: 'Client' }
  });

  // 2. Récupérer tous les produits
  const products = await prisma.product.findMany();

  // 3. Pour chaque client, créer 2 commandes
  for (const client of clients) {
    for (let i = 0; i < 2; i++) {
      // Sélectionner de 1 à 3 produits au hasard
      const selected = shuffle(products).slice(0, Math.floor(Math.random() * 3) + 1);

      // Calculer le total (somme des prix)
      const total = selected.reduce(
        (sum, p) => sum.plus(p.price),
        new Prisma.Decimal(0)
      );

      // Créer la commande et lier les produits
      const order = await prisma.order.create({
        data: {
          userId: client.id,
          products: {
            connect: selected.map(p => ({ id: p.id }))
          },
          status: 'Pending',
          total
        }
      });

      console.log(`✅ Order ${order.id} created for ${client.email}, total: ${total.toString()}`);
    }
  }
}

main()
  .then(() => {
    console.log('🌱 Orders seeding complete.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });

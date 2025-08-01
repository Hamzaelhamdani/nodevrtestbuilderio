import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Get all orders for a startup
export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // For development - if no user, get orders from first startup
    let startup;
    if (userId) {
      startup = await prisma.startup.findUnique({
        where: { ownerId: userId }
      });
    } else {
      // Development mode - get first startup
      startup = await prisma.startup.findFirst();
    }

    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    // Get orders for products belonging to this startup
    const orders = await prisma.order.findMany({
      where: {
        products: {
          some: {
            startupId: startup.id
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        products: {
          where: {
            startupId: startup.id
          },
          select: {
            id: true,
            name: true,
            price: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform orders to match frontend expectations
    const transformedOrders = orders.map(order => ({
      id: order.id,
      customer_name: order.user.name,
      customer_email: order.user.email,
      total_amount: parseFloat(order.total.toString()),
      status: order.status.toLowerCase(),
      created_at: order.createdAt.toISOString(),
      items: order.products.map(product => ({
        product_name: product.name,
        quantity: 1, // Default quantity since it's not in the current schema
        price: parseFloat(product.price.toString())
      }))
    }));

    res.json({ data: transformedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get customers for a startup (users who have ordered products)
export const getCustomers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // For development - if no user, get customers from first startup
    let startup;
    if (userId) {
      startup = await prisma.startup.findUnique({
        where: { ownerId: userId }
      });
    } else {
      // Development mode - get first startup
      startup = await prisma.startup.findFirst();
    }

    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    // Get unique customers who have ordered products from this startup
    const customers = await prisma.$queryRaw`
      SELECT DISTINCT 
        u.id,
        u.name,
        u.email,
        COALESCE(SUM(o.total), 0) as total_spent,
        COUNT(DISTINCT o.id) as orders_count,
        MIN(o."createdAt") as created_at
      FROM "User" u
      INNER JOIN "Order" o ON u.id = o."userId"
      INNER JOIN "_OrderToProduct" otp ON o.id = otp."A"
      INNER JOIN "Product" p ON otp."B" = p.id
      WHERE p."startupId" = ${startup.id}
      GROUP BY u.id, u.name, u.email
      ORDER BY total_spent DESC
    ` as any[];

    // Transform customers to match frontend expectations
    const transformedCustomers = customers.map((customer: any) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      total_spent: parseFloat(customer.total_spent.toString()),
      orders_count: parseInt(customer.orders_count),
      created_at: customer.created_at.toISOString()
    }));

    res.json({ data: transformedCustomers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    // Return empty array instead of error for development
    res.json({ data: [] });
  }
};

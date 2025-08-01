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

// Get all products for a startup
export const getProducts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    // For development - if no user, get products from first startup
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

    const products = await prisma.product.findMany({
      where: {
        startupId: startup.id
      },
      include: {
        category: true
      },
      orderBy: {
        id: 'desc'
      }
    });

    // Transform products to match frontend expectations
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: parseFloat(product.price.toString()),
      stock_quantity: product.inventory,
      status: 'active', // Default status since it's not in schema
      category: product.category?.name || 'General',
      created_at: new Date().toISOString() // Mock created_at
    }));

    res.json({ data: transformedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, description, price, stock_quantity, category, type = 'Physical' } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ error: 'Name, description, and price are required' });
    }

    // Get startup - with development mode fallback
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

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        inventory: parseInt(stock_quantity) || 0,
        type: type, // Physical, Digital, or Subscription
        startupId: startup.id
      }
    });

    // Transform to match frontend expectations
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: parseFloat(product.price.toString()),
      stock_quantity: product.inventory,
      status: 'active',
      category: 'General',
      created_at: new Date().toISOString()
    };

    res.status(201).json({ data: transformedProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update a product
export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { name, description, price, stock_quantity, type } = req.body;

    // Get startup - with development mode fallback
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

    // Check if product belongs to user's startup
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        startupId: startup.id
      }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found or access denied' });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(stock_quantity !== undefined && { inventory: parseInt(stock_quantity) }),
        ...(type && { type })
      }
    });

    // Transform to match frontend expectations
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: parseFloat(product.price.toString()),
      stock_quantity: product.inventory,
      status: 'active',
      category: 'General',
      created_at: new Date().toISOString()
    };

    res.json({ data: transformedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete a product
export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // Get startup - with development mode fallback
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

    // Check if product belongs to user's startup
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        startupId: startup.id
      }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found or access denied' });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Get a single product
export const getProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get the startup for this user
    const startup = await prisma.startup.findUnique({
      where: { ownerId: userId }
    });

    if (!startup) {
      return res.status(404).json({ error: 'Startup not found for this user' });
    }

    const product = await prisma.product.findFirst({
      where: {
        id,
        startupId: startup.id
      },
      include: {
        category: true
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Transform to match frontend expectations
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: parseFloat(product.price.toString()),
      stock_quantity: product.inventory,
      status: 'active',
      category: product.category?.name || 'General',
      created_at: new Date().toISOString()
    };

    res.json({ data: transformedProduct });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

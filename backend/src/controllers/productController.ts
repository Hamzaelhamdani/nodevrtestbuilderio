// Get all products (all startups) for Marketplace
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, startup: true },
      orderBy: { id: 'desc' }
    });
    
    // Debug: Log raw products from database
    console.log('🔍 Raw products from DB:', products.slice(0, 5).map(p => ({
      id: p.id,
      name: p.name,
      categoryId: p.categoryId,
      category: p.category,
      categoryName: p.category?.name
    })));
    
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: parseFloat(product.price.toString()),
      stock_quantity: product.inventory,
      status: 'active',
      category: product.category?.name || 'General',
      created_at: new Date().toISOString(),
      images: product.image ? [product.image] : [],
      startup: product.startup ? { name: product.startup.name, logo: product.startup.logo } : null
    }));
    
    console.log('🔍 Transformed products:', transformedProducts.slice(0, 5).map(p => ({
      name: p.name,
      category: p.category
    })));
    
    res.json({ data: transformedProducts });
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: 'Failed to fetch all products' });
  }
};

// Get all categories for debugging
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    
    console.log('🔍 All categories in DB:', categories);
    
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};
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
    const transformedProducts = products.map(product => {
      console.log('🔍 Raw product from DB:', { 
        id: product.id, 
        name: product.name, 
        image: product.image 
      });
      
      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: parseFloat(product.price.toString()),
        stock_quantity: product.inventory,
        status: 'active', // Default status since it's not in schema
        category: product.category?.name || 'General',
        created_at: new Date().toISOString(), // Mock created_at
        images: product.image ? [product.image] : [] // Include the image URL
      };
    });

    console.log('📦 Transformed products being sent to frontend:', transformedProducts.map(p => ({ 
      name: p.name, 
      images: p.images 
    })));

    res.json({ data: transformedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, description, price, stock_quantity, category, type = 'Physical', image, images } = req.body;

    console.log('📦 Creating product with data:', {
      name, description, price, stock_quantity, category, type, image, images
    });

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

    // Use the first image from images array or the single image field
    const primaryImage = images && images.length > 0 ? images[0] : image;


    // Find or create category if provided
    let categoryId = undefined;
    if (category) {
      let cat = await prisma.category.findFirst({ where: { name: category } });
      if (!cat) {
        cat = await prisma.category.create({ data: { name: category } });
      }
      categoryId = cat.id;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        inventory: parseInt(stock_quantity) || 0,
        type: type, // Physical, Digital, or Subscription
        image: primaryImage || null, // Save the primary image URL
        startupId: startup.id,
        ...(categoryId && { categoryId })
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
      category: category || 'General',
      created_at: new Date().toISOString(),
      images: product.image ? [product.image] : [] // Include the image URL
    };

    console.log('✅ Product created with image:', transformedProduct);
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
    const { name, description, price, stock_quantity, type, image, images, category } = req.body;

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

    // Si images est fourni (tableau), on met à jour image (la principale) avec le premier élément ou null
    let imageToSave = image;
    if (Array.isArray(images)) {
      imageToSave = images.length > 0 ? images[0] : null;
    }

    // Find or create category if provided
    let categoryId = undefined;
    if (category) {
      let cat = await prisma.category.findFirst({ where: { name: category } });
      if (!cat) {
        cat = await prisma.category.create({ data: { name: category } });
      }
      categoryId = cat.id;
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(stock_quantity !== undefined && { inventory: parseInt(stock_quantity) }),
        ...(type && { type }),
        image: imageToSave,
        ...(categoryId && { categoryId })
      }
    });

    // Transform to match frontend expectations
    // Récupère la catégorie à jour
    let catName = 'General';
    if (product.categoryId) {
      const cat = await prisma.category.findUnique({ where: { id: product.categoryId } });
      if (cat) catName = cat.name;
    }
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: parseFloat(product.price.toString()),
      stock_quantity: product.inventory,
      status: 'active',
      category: catName,
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

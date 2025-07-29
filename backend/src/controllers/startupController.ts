// Get all support structure partnerships for the startup owned by the authenticated user
export const getStartupSupportStructures = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    // Find the startup owned by this user
    const startup = await prisma.startup.findUnique({
      where: { ownerId: req.userId },
    });
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found for this user' });
    }
    // Get all support structure partnerships for this startup
    const partnerships = await prisma.supportStructureStartup.findMany({
      where: { startupId: startup.id },
      include: {
        supportStructure: true
      }
    });
    res.json(partnerships);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching support structures', error: error.message });
  }
};
// Get all products for the startup owned by the authenticated user
export const getStartupProducts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    // Find the startup owned by this user
    const startup = await prisma.startup.findUnique({
      where: { ownerId: req.userId },
    });
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found for this user' });
    }
    // Get all products for this startup
    const products = await prisma.product.findMany({
      where: { startupId: startup.id },
      orderBy: { name: 'asc' }
    });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};
import { AuthenticatedRequest } from '../middleware/authMiddleware';
// Get dashboard KPIs for the startup owned by the authenticated user
export const getStartupDashboardKPIs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    // Find the startup owned by this user
    const startup = await prisma.startup.findUnique({
      where: { ownerId: req.userId },
    });
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found for this user' });
    }
    // Count products
    const totalProducts = await prisma.product.count({ where: { startupId: startup.id } });
    // Count orders (for products belonging to this startup)
    const totalOrders = await prisma.order.count({
      where: {
        products: {
          some: { startupId: startup.id }
        }
      }
    });
    // Sum revenue (total of all orders for this startup's products)
    const revenueResult = await prisma.order.aggregate({
      _sum: { total: true },
      where: {
        products: {
          some: { startupId: startup.id }
        }
      }
    });
    const totalRevenue = revenueResult._sum.total || 0;
    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      startupName: startup.name
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching dashboard KPIs', error: error.message });
  }
};
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllStartups = async (_req: Request, res: Response) => {
  try {
    const startups = await prisma.startup.findMany();
    res.status(200).json(startups);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching startups', error: error.message });
  }
};

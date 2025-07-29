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

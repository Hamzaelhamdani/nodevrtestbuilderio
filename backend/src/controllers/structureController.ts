// backend/src/controllers/structureController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllStructures = async (_req: Request, res: Response) => {
  try {
    const structures = await prisma.supportStructure.findMany();
    res.status(200).json(structures);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching structures', error: error.message });
  }
};

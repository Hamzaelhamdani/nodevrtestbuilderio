// backend/src/controllers/authController.ts
import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import { hashPassword, comparePasswords } from "../utils/hash";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Durée de validité du token
const JWT_EXPIRES_IN = "8h";

// Clé secrète (doit être définie dans .env : JWT_SECRET=your_secret_here)
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("❌ Missing JWT_SECRET in environment");
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role, name } = req.body;

    if (!email || !password || !role || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Créer l’utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role as Role,
        name,
      },
    });

    // Générer un JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Enlever le mot de passe avant de répondre
    // @ts-ignore
    const { password: _, ...safeUser } = user;

    res.status(201).json({
      message: "User registered",
      user: safeUser,
      token,
    });
  } catch (error: any) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message || error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    // Trouver l’utilisateur
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Vérifier le mot de passe
    const isValid = await comparePasswords(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Générer un JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Enlever le mot de passe avant de répondre
    // @ts-ignore
    const { password: _, ...safeUser } = user;

    res.status(200).json({
      message: "Login successful",
      user: safeUser,
      token,
    });
  } catch (error: any) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

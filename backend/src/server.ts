// backend/src/server.ts

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Compatible __dirname for ESM or CommonJS
let __dirname;
try {
  __dirname = typeof global.__dirname !== 'undefined' ? global.__dirname : path.dirname(fileURLToPath(import.meta.url));
} catch (e) {
  __dirname = process.cwd();
}

import authRoutes from './routes/authRoutes.js';
import meRoute from './routes/meRoute.js';
import startupRoutes from './routes/startupRoutes.js';
import structureRoutes from './routes/structureRoutes.js';
import productRoutes from './routes/products.js';
import dashboardRoutes from './routes/dashboard.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// ✅ Activer CORS pour le frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// ✅ Parser le JSON et les cookies
app.use(express.json());
app.use(cookieParser());

// ——— Routes Auth ———
// Inscription & connexion
app.use('/api/auth', authRoutes);

// ——— Autres Routes ———
// Liste des startups (publique ou protégée selon besoin)
app.use('/api/startups', startupRoutes);

// Liste des support structures
app.use('/api/structures', structureRoutes);

// Routes produits (protégées)
app.use('/api/products', productRoutes);

// Routes dashboard (protégées)
app.use('/api', dashboardRoutes);

// Routes upload d'images
app.use('/api', uploadRoutes);

// Add logging middleware for static file requests BEFORE serving static files
app.use('/api/uploads/images', (req, res, next) => {
  console.log('📸 Static image request:', req.path);
  console.log('📁 Full path:', path.join(__dirname, '..', '..', 'uploads', 'images'));
  next();
});

// Serve uploaded images statically
// Use __dirname to get the absolute path from the server.ts location

// Compatible __dirname for ESM or CommonJS
const getUploadsPath = () => {
  let baseDir;
  try {
    baseDir = typeof __dirname !== 'undefined' ? __dirname : path.dirname(new URL(import.meta.url).pathname);
  } catch (e) {
    baseDir = process.cwd();
  }
  const uploadsPath = path.join(baseDir, '..', '..', 'uploads', 'images');
  console.log('📁 Serving static images from:', uploadsPath);
  return uploadsPath;
};
app.use('/api/uploads/images', express.static(getUploadsPath()));

console.log('✅ Routes chargées avec succès');
console.log('✅ Environnement chargé, lancement du serveur...');

// Health check
app.get('/', (_req, res) => {
  res.send('VenturesRoom backend is running ✅');
});

// Démarrage
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('❌ Erreur au lancement du serveur :', err);
});

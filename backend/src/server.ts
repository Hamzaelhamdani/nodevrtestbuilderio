// backend/src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import meRoute from './routes/meRoute.js';
import startupRoutes from './routes/startupRoutes.js';
import structureRoutes from './routes/structureRoutes.js';
import productRoutes from './routes/products.js';
import dashboardRoutes from './routes/dashboard.js';
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

console.log('✅ Routes chargées avec succès');
console.log('✅ Environnement chargé, lancement du serveur...');

// Health check
app.get('/', (_req, res) => {
  res.send('VenturesRoom backend is running ✅');
});

// Démarrage
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('❌ Erreur au lancement du serveur :', err);
});

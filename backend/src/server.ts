import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.ts';
import cors from 'cors';

dotenv.config();

const app = express(); // ✅ d'abord créer l'app

// ✅ ensuite activer CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use('/api/auth', authRoutes);

console.log("✅ authRoutes chargé avec succès");
console.log("✅ Environnement chargé, lancement du serveur...");

app.get('/', (_, res) => {
  res.send('VenturesRoom backend is running ✅');
});

const PORT = process.env.PORT || 5000;

try {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  }).on('error', (err) => {
    console.error('❌ Erreur au lancement du serveur :', err);
  });
} catch (err) {
  console.error('❌ Exception globale capturée :', err);
}

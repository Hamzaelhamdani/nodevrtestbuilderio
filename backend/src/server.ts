import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.ts' // <- utilise .ts si c'est TypeScript

dotenv.config()
console.log("✅ authRoutes chargé avec succès")

console.log("✅ Environnement chargé, lancement du serveur...")

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use('/api/auth', authRoutes)

app.get('/', (_, res) => {
  res.send('VenturesRoom backend is running ✅')
})

try {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`)
  }).on('error', (err) => {
    console.error('❌ Erreur au lancement du serveur :', err)
  })
} catch (err) {
  console.error('❌ Exception globale capturée :', err)
}

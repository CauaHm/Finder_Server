import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from "../src/routes/authRoute.js"
import { authenticateToken } from '../src/controllers/authController.js';
import { connectDB } from '../db.js'
dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
connectDB();
app.get('/', (req, res) => res.send('API do Finder está online 🚀'));

// Rotas de autenticação
app.use('/api/auth', authRoutes);

app.get('/me', authenticateToken, async (req, res) => {
  // req.user foi definido pelo middleware
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

  // Remove a senha antes de enviar
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});


const PORT = process.env.PORT || 5000;
module.exports = app;
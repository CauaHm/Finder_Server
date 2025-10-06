import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "../src/routes/authRoute.js";
import { authenticateToken } from "../src/controllers/authController.js";
import { connectDB } from "../db.js";
dotenv.config();
const app = express();
const prisma = new PrismaClient();

const allowedOrigins = [
  "http://localhost:5000",
  "https://finder-react-ten.vercel.app/",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors());
app.use(express.json());
connectDB();
app.get("/", (req, res) => res.send("API do Finder está online 🚀"));

// Rotas de autenticação
app.use("/api/auth", authRoutes);

app.get("/me", authenticateToken, async (req, res) => {
  // req.user foi definido pelo middleware
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

  // Remove a senha antes de enviar
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes"; // Importa las rutas
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // Para manejar JSON en las solicitudes

// Configurar las rutas
app.use("/api/auth", authRoutes);  // Esto añade el prefijo "/api/auth" para las rutas de auth

// Middleware para manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err); // Puedes registrar el error para fines de depuración
  res.status(500).json({ message: "Algo salió mal", error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

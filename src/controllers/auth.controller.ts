import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';  // Para el hashing de contraseñas
import { PrismaClient } from "@prisma/client";  // Asumiendo que usas Prisma para interactuar con la base de datos

const prisma = new PrismaClient();

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Validación básica de los datos
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "Usuario registrado exitosamente", user: newUser });
  } catch (error) {
    next(error);  // Pasar el error al middleware de manejo de errores
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    // Buscar al usuario en la base de datos
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Comparar la contraseña hasheada con la proporcionada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    return res.status(200).json({ message: "Login exitoso", user });
  } catch (error) {
    next(error);
  }
};

export { register, login };

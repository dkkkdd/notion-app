import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Достаем токен из заголовка

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId; // Добавляем userId в объект запроса
    next(); // Идем дальше к контроллеру
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
};

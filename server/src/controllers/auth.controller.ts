// server/controllers/auth.controller.ts
import { Request, Response } from "express";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

//registration
export async function register(req: Request, res: Response) {
  const { userName, email, password } = req.body;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        userName: userName || email.split("@")[0],
        email,
        passwordHash: hashedPassword,
      },
      include: {
        _count: {
          select: {
            projects: true,
            tasks: true,
          },
        },
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        _count: user._count,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
}
// server/controllers/auth.controller.ts

export async function getMe(req: any, res: Response) {
  const userId = req.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userName: true,
        createdAt: true,
        _count: {
          select: {
            projects: true,
            tasks: { where: { isDone: false } },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateMe(req: any, res: Response) {
  const userId = req.userId;
  const { userName, email } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(userName !== undefined && { userName }),
        ...(email !== undefined && { email }),
        // avatarUrl: avatar, // когда доберемся до загрузки файлов
      },
      select: {
        id: true,
        email: true,
        userName: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error: any) {
    // Если юзер решит сменить email на тот, что уже занят
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Этот email уже занят" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}
//login
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        _count: {
          select: {
            projects: true,
            tasks: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        _count: user._count,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

//delete account
export async function deleteAcc(req: any, res: Response) {
  const userId = req.userId;

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Delete Acc Error:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
}

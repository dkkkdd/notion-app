import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function createUser(req: Request, res: Response) {
  const { email, passwordHash } = req.body;

  if (!email || !passwordHash) {
    return res
      .status(400)
      .json({ error: "email and passwordHash are required" });
  }
  router.get("/", async (_req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
  });

  // Проверяем, есть ли уже пользователь с таким email
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const user = await prisma.user.create({
    data: { email, passwordHash },
  });

  res.status(201).json(user);
}

export async function getUser(req: Request, res: Response) {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { projects: true, tasks: true },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;

  await prisma.user.delete({ where: { id } });

  res.status(204).send();
}

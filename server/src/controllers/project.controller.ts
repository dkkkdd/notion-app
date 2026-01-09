import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function getProjects(req: any, res: Response) {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      // Считаем количество задач, чтобы не тянуть их все (опционально для оптимизации)
      _count: { select: { tasks: true } },
    },
    // ОБЯЗАТЕЛЬНО: Сортируем по порядку
    orderBy: {
      order: "asc",
    },
  });

  res.json(projects);
}

export async function createProject(req: any, res: Response) {
  const { title, color, favorites, order } = req.body;
  const userId = req.userId; // Достаем из middleware

  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  const project = await prisma.project.create({
    data: {
      title,
      color,
      favorites: favorites ?? false,
      userId,
      order: order ?? 0,
    },
  });

  res.status(201).json(project);
}

export async function updateProject(req: Request, res: Response) {
  const { id } = req.params;
  // Используем деструктуризацию, чтобы было чище
  const { title, color, favorites, order } = req.body;

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(color !== undefined && { color }),
        ...(favorites !== undefined && { favorites }),
        ...(order !== undefined && { order }), // Позволяем менять порядок
      },
    });
    res.json(project);
  } catch (error) {
    res.status(404).json({ error: "Project not found" });
  }
}

export async function deleteProject(req: Request, res: Response) {
  const { id } = req.params;

  // Если удаляем проект, Prisma сама удалит задачи (если в схеме ON DELETE CASCADE)
  // или выдаст ошибку, если связи защищены.
  await prisma.project.delete({ where: { id } });

  res.status(204).send();
}

export async function getProjectTasks(req: Request, res: Response) {
  const { projectId } = req.params;

  const tasks = await prisma.task.findMany({
    where: { projectId },
    // Здесь тоже логично добавить сортировку по order
    orderBy: { order: "asc" },
  });

  res.json(tasks);
}

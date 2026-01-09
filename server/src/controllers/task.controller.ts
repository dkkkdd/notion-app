import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function getTasks(req: Request, res: Response) {
  const { userId, projectId, isDone } = req.query;
  const isDoneFilter =
    isDone === "true" ? true : isDone === "false" ? false : undefined;

  const tasks = await prisma.task.findMany({
    where: {
      ...(userId && { userId: String(userId) }),
      ...(projectId === "null"
        ? { projectId: null }
        : projectId
        ? { projectId: String(projectId) }
        : {}),
      ...(isDoneFilter !== undefined && { isDone: isDoneFilter }),
    },
    orderBy: isDoneFilter === true ? { completedAt: "desc" } : { order: "asc" },
    include: {
      subtasks: true,
    },
  });

  res.json(tasks);
}

// server/controllers/tasks.ts
export async function createTask(req: Request, res: Response) {
  try {
    const {
      title,
      userId,
      projectId,
      comment,
      deadline,
      priority,
      parentId,
      order,
      reminderAt,
    } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        userId,
        projectId: projectId === "" || projectId === "null" ? null : projectId,
        parentId: parentId || null,
        comment: comment || null,
        priority: Number(priority) || 1,
        order: Number(order) || 0,
        deadline: deadline ? new Date(deadline) : null, // Это оставляем датой
        reminderAt: reminderAt || null, // Шлем просто строку "16:39" или null
      },
    });

    res.status(201).json(task);
  } catch (error: any) {
    console.error("ОШИБКА PRISMA:", error);
    res.status(500).json({ error: error.message });
  }
}
export async function updateTask(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;

  const isDone = data.isDone;

  if (data.deadline) {
    data.deadline = new Date(data.deadline);
  }

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...data,
        ...(isDone !== undefined && {
          completedAt: isDone ? new Date() : null,
        }),
      },
    });
    res.json(task);
  } catch (error) {
    res.status(404).json({ error: "Task not found" });
  }
}

export async function deleteTask(req: Request, res: Response) {
  const { id } = req.params;

  await prisma.task.delete({ where: { id } });
  res.status(204).send();
}

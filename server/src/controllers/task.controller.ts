// server/controllers/tasks.ts
import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function getTasks(req: any, res: Response) {
  const { projectId, isDone } = req.query;
  const userId = req.userId; // Берем из токена

  const isDoneFilter =
    isDone === "true" ? true : isDone === "false" ? false : undefined;

  const tasks = await prisma.task.findMany({
    where: {
      parentId: null,
      userId: userId, // Фильтруем, чтобы юзер видел только свои задачи
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
      section: true,
    },
  });

  res.json(tasks);
}

export async function createTask(req: any, res: Response) {
  try {
    const {
      title,
      projectId,
      sectionId,
      parentId,
      comment,
      deadline,
      priority,
      order,
      reminderAt,
    } = req.body;

    const userId = req.userId;
    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        userId,
        projectId: projectId === "" || projectId === "null" ? null : projectId,
        sectionId: sectionId === "" || sectionId === "null" ? null : sectionId,
        parentId: parentId || null,
        comment: comment || null,
        priority: Number(priority) || 1,
        order: Number(order) || 0,
        deadline: deadline ? new Date(deadline) : null,
        reminderAt: reminderAt || null,
      },
    });

    res.status(201).json(task);
  } catch (error: any) {
    console.error("ОШИБКА PRISMA:", error);
    res.status(500).json({ error: error.message });
  }
}

export async function updateTask(req: any, res: Response) {
  const { id } = req.params;
  const data = req.body;
  const userId = req.userId;
  delete data.userId;
  delete data.id;

  if (data.deadline) data.deadline = new Date(data.deadline);
  if (data.order !== undefined) data.order = Number(data.order);
  if (data.priority !== undefined) data.priority = Number(data.priority);

  try {
    const task = await prisma.task.updateMany({
      where: { id, userId },
      data: {
        ...data,
        ...(data.isDone !== undefined && {
          completedAt: data.isDone ? new Date() : null,
        }),
      },
    });

    if (task.count === 0) {
      return res.status(404).json({ error: "Task not found or access denied" });
    }
    const updatedTask = await prisma.task.findUnique({
      where: { id },
      include: { subtasks: true },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(404).json({ error: "Task not found" });
  }
}

export async function deleteTask(req: any, res: Response) {
  const { id } = req.params;
  const userId = req.userId;
  try {
    await prisma.task.deleteMany({ where: { id, userId } });
    res.status(204).send();
  } catch (e) {
    res.status(404).json({ error: "Task not found" });
  }
}

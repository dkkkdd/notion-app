import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function getTasks(req: any, res: Response) {
  const { projectId, isDone } = req.query;
  const userId = req.userId;

  const isDoneFilter =
    isDone === "true" ? true : isDone === "false" ? false : undefined;

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      parentId: null,
      projectId: projectId === "null" ? null : projectId || undefined,
      isDone: isDoneFilter ?? undefined,
    },
    include: {
      subtasks: {
        orderBy: [{ isDone: "asc" }, { order: "asc" }],
      },
    },
    orderBy:
      isDoneFilter === true
        ? [{ completedAt: "desc" }, { order: "asc" }]
        : [{ isDone: "asc" }, { order: "asc" }],
  });

  res.json(tasks);
}

export async function updateTask(req: any, res: Response) {
  const { id } = req.params;
  const data = req.body;
  const userId = req.userId;

  delete data.userId;
  delete data.id;
  delete data.subtasks;

  if (data.deadline) data.deadline = new Date(data.deadline);

  try {
    await prisma.task.updateMany({
      where: { id, userId },
      data: {
        ...data,
        ...(data.isDone !== undefined && {
          completedAt: data.isDone ? new Date() : null,
        }),
      },
    });

    const updatedTask = await prisma.task.findUnique({
      where: { id },
      include: { subtasks: true },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(404).json({ error: "Task not found" });
  }
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

import { Request, Response } from "express";
import { prisma } from "../prisma";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function getTasks(req: AuthenticatedRequest, res: Response) {
  const { projectId, isDone } = req.query;
  const userId = req.userId as string;
  const projectIdString = Array.isArray(projectId) ? projectId[0] : projectId;

  const isDoneFilter =
    isDone === "true" ? true : isDone === "false" ? false : undefined;

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      parentId: null,
      projectId:
        projectIdString === "null" ? null : projectIdString || undefined,
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

export async function updateTask(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const idString = typeof id === "string" ? id : id?.[0];
  const data = req.body;
  const userId = req.userId as string;

  delete data.userId;
  delete data.id;
  delete data.subtasks;

  if (data.deadline) data.deadline = new Date(data.deadline);

  try {
    await prisma.task.updateMany({
      where: { id: idString, userId },
      data: {
        ...data,
        ...(data.isDone !== undefined && {
          completedAt: data.isDone ? new Date() : null,
        }),
      },
    });

    const updatedTask = await prisma.task.findUnique({
      where: { id: idString },
      include: { subtasks: true },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(404).json({ error: "Task not found" });
  }
}

export async function createTask(req: AuthenticatedRequest, res: Response) {
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

    const userId = req.userId as string;
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
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("ОШИБКА PRISMA:", error);
    res.status(500).json({ error: errorMessage });
  }
}

export async function deleteTask(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const idString = typeof id === "string" ? id : id?.[0];
  const userId = req.userId as string;
  try {
    await prisma.task.deleteMany({ where: { id: idString, userId } });
    res.status(204).send();
  } catch (e) {
    res.status(404).json({ error: "Task not found" });
  }
}

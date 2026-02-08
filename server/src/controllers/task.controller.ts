import { Request, Response } from "express";
import { prisma } from "../prisma";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

function normalizeId(id: string | string[] | undefined): string | undefined {
  if (!id) return undefined;
  return Array.isArray(id) ? id[0] : id;
}

export async function getTasks(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const projectId = normalizeId(req.query.projectId as any);
    const isDoneRaw = req.query.isDone;

    const isDoneFilter =
      isDoneRaw === "true" ? true : isDoneRaw === "false" ? false : undefined;

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        parentId: null,
        projectId: projectId ?? undefined,
        isDone: isDoneFilter,
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
  } catch (error) {
    console.error("GET TASKS ERROR:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}

export async function createTask(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const {
      title,
      projectId,
      sectionId,
      parentId,
      comment,
      deadline,
      priority,
      reminderAt,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const lastTask = await prisma.task.findFirst({
      where: {
        userId,
        sectionId: sectionId ?? null,
        parentId: parentId ?? null,
      },
      orderBy: { order: "desc" },
    });

    const nextOrder = (lastTask?.order ?? 0) + 1;

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        userId,

        projectId: projectId ?? null,
        sectionId: sectionId ?? null,
        parentId: parentId ?? null,

        comment: comment ?? null,
        priority: Number(priority) || 1,
        order: nextOrder,

        deadline: deadline ? new Date(deadline) : null,

        reminderAt: reminderAt ?? null,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
}

export async function updateTask(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const taskId = normalizeId(req.params.id);
    if (!taskId) return res.status(400).json({ error: "Task id required" });

    const data = { ...req.body };

    delete data.userId;
    delete data.id;
    delete data.subtasks;

    if (data.deadline) {
      data.deadline = new Date(data.deadline);
    }

    if (data.reminderAt !== undefined) {
      data.reminderAt = data.reminderAt || null;
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
        userId,
      },
      data: {
        ...data,
        ...(data.isDone !== undefined && {
          completedAt: data.isDone ? new Date() : null,
        }),
      },
      include: {
        subtasks: {
          orderBy: { order: "asc" },
        },
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);
    res.status(404).json({ error: "Task not found" });
  }
}

export async function deleteTask(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const taskId = normalizeId(req.params.id);
    if (!taskId) return res.status(400).json({ error: "Task id required" });

    await prisma.task.delete({
      where: {
        id: taskId,
        userId,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);
    res.status(404).json({ error: "Task not found" });
  }
}

export async function moveTask(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const taskId = normalizeId(req.params.id);
    if (!taskId) return res.status(400).json({ error: "Task id required" });

    const { toSectionId, toParentId, beforeOrder, afterOrder } = req.body;

    if (beforeOrder == null || afterOrder == null) {
      return res.status(400).json({
        error: "beforeOrder and afterOrder are required",
      });
    }

    const newOrder = (Number(beforeOrder) + Number(afterOrder)) / 2;

    const updated = await prisma.task.update({
      where: {
        id: taskId,
        userId,
      },
      data: {
        sectionId: toSectionId ?? null,
        parentId: toParentId ?? null,
        order: newOrder,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("MOVE TASK ERROR:", error);
    res.status(500).json({ error: "Failed to move task" });
  }
}

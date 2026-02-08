import { Request, Response } from "express";
import { prisma } from "../prisma";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

function requireUser(req: AuthenticatedRequest, res: Response): string | null {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return req.userId;
}

export async function getProjects(req: AuthenticatedRequest, res: Response) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      sections: { orderBy: { order: "asc" } },
      _count: { select: { tasks: true } },
    },
    orderBy: { order: "asc" },
  });

  res.json(projects);
}

export async function getProjectBoard(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { id } = req.params;

  const project = await prisma.project.findFirst({
    where: { id: String(id), userId },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          tasks: {
            where: { parentId: null },
            orderBy: { order: "asc" },
            include: {
              subtasks: { orderBy: { order: "asc" } },
            },
          },
        },
      },
      tasks: {
        where: {
          sectionId: null,
          parentId: null,
        },
        orderBy: { order: "asc" },
        include: {
          subtasks: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  res.json(project);
}

export async function createProject(req: AuthenticatedRequest, res: Response) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { title, color, favorites, order } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const project = await prisma.project.create({
    data: {
      title: title.trim(),
      color: color ?? null,
      favorites: favorites ?? false,
      order: order ?? 0,
      userId,
    },
  });

  res.status(201).json(project);
}

export async function updateProject(req: AuthenticatedRequest, res: Response) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { id } = req.params;
  const { title, color, favorites, order } = req.body;

  const existing = await prisma.project.findFirst({
    where: { id: String(id), userId },
  });

  if (!existing) {
    return res.status(404).json({ error: "Project not found" });
  }

  const updated = await prisma.project.update({
    where: { id: String(id) },
    data: {
      ...(title !== undefined && { title: title.trim() }),
      ...(color !== undefined && { color }),
      ...(favorites !== undefined && { favorites }),
      ...(order !== undefined && { order: Number(order) }),
    },
  });

  res.json(updated);
}

export async function deleteProject(req: AuthenticatedRequest, res: Response) {
  const userId = requireUser(req, res);
  if (!userId) return;

  const { id } = req.params;

  const existing = await prisma.project.findFirst({
    where: { id: String(id), userId },
  });

  if (!existing) {
    return res.status(404).json({ error: "Project not found" });
  }

  await prisma.project.delete({
    where: { id: String(id) },
  });

  res.status(204).send();
}

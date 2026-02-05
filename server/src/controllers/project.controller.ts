import { Request, Response } from "express";
import { prisma } from "../prisma";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function getProjects(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId as string;

  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      sections: {
        orderBy: { order: "asc" },
      },
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
  const { id } = req.params;
  const userId = req.userId;
  try {
    const project = await prisma.project.findUnique({
      where: { id: String(id), userId },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            tasks: {
              where: { parentId: null },
              orderBy: { order: "asc" },
              include: {
                subtasks: {
                  orderBy: { order: "asc" },
                },
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
            subtasks: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!project) return res.status(404).json({ error: "Project not found" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project data" });
  }
}

export async function createProject(req: AuthenticatedRequest, res: Response) {
  const { title, color, favorites, order } = req.body;
  const userId = req.userId as string;
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

export async function updateProject(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const userId = req.userId;

  const { title, color, favorites, order } = req.body;

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  try {
    const project = await prisma.project.updateMany({
      where: { id: String(id), userId },
      data: {
        ...(title !== undefined && { title }),
        ...(color !== undefined && { color }),
        ...(favorites !== undefined && { favorites }),
        ...(order !== undefined && { order }),
      },
    });
    res.json(project);
  } catch (error) {
    res.status(404).json({ error: "Project not found" });
  }
}

export async function deleteProject(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const userId = req.userId;

  await prisma.project.deleteMany({ where: { id: String(id), userId } });

  res.status(204).send();
}

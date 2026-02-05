import { Request, Response } from "express";
import { prisma } from "../prisma";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function createSection(req: AuthenticatedRequest, res: Response) {
  try {
    const { title, projectId, order } = req.body;
    const userId = req.userId as string;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) return res.status(403).json({ error: "Access denied" });

    const section = await prisma.section.create({
      data: {
        title,
        order: order ?? 0,
        projectId,
        userId,
      },
    });

    res.status(201).json(section);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
}

export async function updateSection(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { title, order } = req.body;
  const userId = req.userId as string;
  try {
    const section = await prisma.section.updateMany({
      where: { id: String(id), project: { userId } },
      data: {
        ...(title !== undefined && { title }),
        ...(order !== undefined && { order }),
      },
    });
    res.json(section);
  } catch (error) {
    res.status(404).json({ error: "Section not found" });
  }
}

export async function deleteSection(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const userId = req.userId;
  await prisma.section.deleteMany({
    where: { id: String(id), project: { userId } },
  });
  res.status(204).send();
}

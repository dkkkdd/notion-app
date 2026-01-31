import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function createSection(req: any, res: Response) {
  try {
    const { title, projectId, order } = req.body;
    const userId = req.userId;

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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateSection(req: any, res: Response) {
  const { id } = req.params;
  const { title, order } = req.body;
  const userId = req.userId;
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

export async function deleteSection(req: any, res: Response) {
  const { id } = req.params;
  const userId = req.userId;
  await prisma.section.deleteMany({
    where: { id: String(id), project: { userId } },
  });
  res.status(204).send();
}

import { Router } from "express";
import { auth } from "../controllers/auth.controller";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectTasks,
} from "../controllers/project.controller";
console.log("PROJECT ROUTES LOADED");

const router = Router();
router.get("/", auth, getProjects);
router.post("/", auth, createProject);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);
router.get("/:projectId/tasks", getProjectTasks);

export default router;

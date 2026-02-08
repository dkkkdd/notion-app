import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
} from "../controllers/task.controller";

import { authMiddleware } from "../middleware/auth";
const router = Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/move", moveTask);

export default router;

import { Router } from "express";
import {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/section.controller";

import { authMiddleware } from "../middleware/auth";
const router = Router();

router.use(authMiddleware);

router.post("/", createSection);
router.patch("/:id", updateSection);
router.delete("/:id", deleteSection);

export default router;

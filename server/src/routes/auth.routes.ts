import { Router } from "express";
import {
  register,
  login,
  deleteAcc,
  getMe,
  updateMe,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/me", authMiddleware, getMe);
router.post("/register", register);
router.patch("/me", authMiddleware, updateMe);
router.post("/login", login);
router.delete("/me", authMiddleware, deleteAcc);

export default router;

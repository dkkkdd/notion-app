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
// POST /api/auth/register
router.post("/register", register);

router.patch("/me", authMiddleware, updateMe);
// POST /api/auth/login
router.post("/login", login);
//  DELETE /api/auth/me
router.delete("/me", authMiddleware, deleteAcc);

export default router;

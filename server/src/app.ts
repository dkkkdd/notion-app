// server/app.ts
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import sectionRoutes from "./routes/section.routes";
import { authMiddleware } from "./middleware/auth";

export const app = express();

app.use(cors());
app.use(express.json());

// 1. Публичные роуты
app.use("/api/auth", authRoutes);

// 2. Защищенные роуты (Middleware применяется ко всем роутам в этих ветках)
app.use("/api/projects", authMiddleware, projectRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);
app.use("/api/sections", authMiddleware, sectionRoutes);

import express from "express";
import cors from "cors";

import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});

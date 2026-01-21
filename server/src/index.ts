// server/index.ts
import { app } from "./app";

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server is flying on http://localhost:${PORT}`);
});

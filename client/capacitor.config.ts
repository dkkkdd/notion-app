import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.taskmanager.app",
  appName: "Task Manager",
  webDir: "dist",
  server: {
    url: "https://task-managerr.pp.ua",
    cleartext: true,
  },
};

export default config;

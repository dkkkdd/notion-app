import { api } from "./client";
import type { User } from "../types/user";

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>("/auth/login", credentials),

  register: (data: { userName: string; email: string; password: string }) =>
    api.post<{ token: string; user: User }>("/auth/register", data),

  getMe: () => api.get<User>("/auth/me"),

  updateMe: (data: Partial<User>) => api.patch<User>("/auth/me", data),
  deleteMe: () => api.delete<void>("/auth/me"),
};

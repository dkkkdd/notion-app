import { api } from "@/api/client";
import type { User } from "@/types/user";

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post<{ user: User }>("/auth/login", credentials),

  logout: () => api.post<void>("/auth/logout", null),

  register: (data: { userName: string; email: string; password: string }) =>
    api.post<{ user: User }>("/auth/register", data),

  getMe: () => api.get<User>("/auth/me"),

  updateMe: (data: Partial<User>) => api.patch<User>("/auth/me", data),
  deleteMe: () => api.delete<void>("/auth/me"),
};

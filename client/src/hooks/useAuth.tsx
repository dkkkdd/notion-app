import { useEffect, useState } from "react";
import type { User } from "@/types/user";
import { authApi } from "@/api/auth";

type UpdateMeDto = {
  userName?: string;
  email?: string;
};

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    const { user } = await authApi.login(data);
    setUser(user);
  };

  const register = async (data: {
    userName: string;
    email: string;
    password: string;
  }) => {
    const { user } = await authApi.register(data);
    setUser(user);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const remove = async () => {
    await authApi.deleteMe();
    await logout();
  };

  const update = async (data: UpdateMeDto) => {
    const oldUser = user;

    if (user) setUser({ ...user, ...data });

    try {
      const updatedUser = await authApi.updateMe(data);
      setUser(updatedUser);
    } catch (err) {
      setUser(oldUser);
      throw err;
    }
  };

  const getMe = async () => {
    try {
      const userData = await authApi.getMe();
      setUser(userData);
      return userData;
    } catch (err) {
      console.error("Fetch user failed", err);
      throw err;
    }
  };

  return {
    user,
    loading,
    registerUser: register,
    loginUser: login,
    deleteUser: remove,
    updateUserInfo: update,
    logoutUser: logout,
    getMe: getMe,
    isAuthenticated: !!user,
  };
}

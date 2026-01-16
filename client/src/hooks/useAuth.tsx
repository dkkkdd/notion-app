import { useEffect, useState } from "react";
import type { User } from "../types/user";
import { authApi } from "../api/auth";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authApi.getMe();
        setUser(userData);
      } catch (err) {
        console.error("Session expired or invalid");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    const { token, user } = await authApi.login(data);
    localStorage.setItem("token", token);
    setUser(user);
  };

  const register = async (data: {
    userName: string;
    email: string;
    password: string;
  }) => {
    const { token, user } = await authApi.register(data);
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const remove = async () => {
    try {
      await authApi.deleteMe();
    } catch (err) {
      console.error(err);
    } finally {
      logout();
    }
  };

  const update = async (data: Partial<User>) => {
    const oldInfo = user;

    if (user) {
      setUser({ ...user, ...data });
    }
    try {
      const newInfo = await authApi.updateMe(data);
      setUser(newInfo);
    } catch (err) {
      setUser(oldInfo);
      console.error("Update failed", err);
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

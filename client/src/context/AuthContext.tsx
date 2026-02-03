import { createContext, useMemo, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types/user";

type AuthState = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
};

type AuthActions = {
  loginUser: ReturnType<typeof useAuth>["loginUser"];
  logoutUser: ReturnType<typeof useAuth>["logoutUser"];
  registerUser: ReturnType<typeof useAuth>["registerUser"];
  deleteUser: ReturnType<typeof useAuth>["deleteUser"];
  updateUserInfo: ReturnType<typeof useAuth>["updateUserInfo"];
  getMe: ReturnType<typeof useAuth>["getMe"];
};

export const AuthStateContext = createContext<AuthState | null>(null);
export const AuthActionsContext = createContext<AuthActions | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    user,
    loading,
    isAuthenticated,
    loginUser,
    logoutUser,
    registerUser,
    deleteUser,
    updateUserInfo,
    getMe,
  } = useAuth();

  const actions = useMemo(
    () => ({
      loginUser,
      logoutUser,
      registerUser,
      deleteUser,
      updateUserInfo,
      getMe,
    }),
    [loginUser, logoutUser, registerUser, deleteUser, updateUserInfo, getMe],
  );

  const state = useMemo(
    () => ({ user, loading, isAuthenticated }),
    [user, loading, isAuthenticated],
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe();
    }
  }, [getMe]);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionsContext.Provider value={actions}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
}

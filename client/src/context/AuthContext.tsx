import { createContext, useContext, useMemo, useEffect } from "react";
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

const AuthStateContext = createContext<AuthState | null>(null);
const AuthActionsContext = createContext<AuthActions | null>(null);

export function AuthProvider({ children }: any) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe();
    }
  }, []);
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
    [loginUser, logoutUser, registerUser, deleteUser, updateUserInfo]
  );

  const state = useMemo(
    () => ({ user, loading, isAuthenticated }),
    [user, loading, isAuthenticated]
  );

  return (
    <AuthStateContext.Provider value={state}>
      <AuthActionsContext.Provider value={actions}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
}

// Кастомные хуки для удобного доступа
export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (!context)
    throw new Error("useAuthState must be used within AuthProvider");
  return context;
};

export const useAuthContext = () => {
  const context = useContext(AuthActionsContext);
  if (!context)
    throw new Error("useAuthActions must be used within AuthProvider");
  return context;
};

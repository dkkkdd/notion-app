import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuthState } from "./context/AuthContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import { TasksProvider } from "./context/TasksContext";
import { AppLayout } from "./components/AppLayout";
import { TaskList } from "./components/Tasks/TaskList";
import { AuthPage } from "./components/AuthPage";
import { useProjectsContext } from "./context/ProjectsContext";
import { useEffect } from "react";
import { applyTheme } from "./components/User/UserInfo";
import { useTranslation } from "react-i18next";
import { ProjectPage } from "./components/Projects/ProjectPage";

// Обертка для задач
function TasksWrapper({ children }: { children: React.ReactNode }) {
  const { mode, selectedProjectId } = useProjectsContext();
  return (
    <TasksProvider
      mode={mode}
      selectedProjectId={selectedProjectId}
      key={`${mode}-${selectedProjectId}`}
    >
      {children}
    </TasksProvider>
  );
}
export function MainContent() {
  const { mode } = useProjectsContext();

  if (mode === "projects") {
    return <ProjectPage />;
  }

  return <TaskList />;
}

function ProtectedApp() {
  return (
    <ProjectsProvider>
      <TasksWrapper>
        <AppLayout>
          <MainContent />
        </AppLayout>
      </TasksWrapper>
    </ProjectsProvider>
  );
}

function AppContent() {
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useAuthState();
  const location = useLocation();
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const savedTheme = localStorage.getItem("theme") || "system";
      if (savedTheme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#111] text-white">
        {t("loading")}...
      </div>
    );

  return (
    <Routes>
      {/* ПУБЛИЧНЫЕ РОУТЫ */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            // Если залогинен, возвращаем на "откуда пришел" или на главную
            <Navigate to={location.state?.from?.pathname || "/"} replace />
          ) : (
            <AuthPage isLoginMode={true} />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <AuthPage isLoginMode={false} />
          )
        }
      />

      {/* ЗАЩИЩЕННЫЕ РОУТЫ */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <ProtectedApp />
          ) : (
            // Сохраняем текущий путь в state перед редиректом на логин
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

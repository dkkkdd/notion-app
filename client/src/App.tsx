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
import { AppLayout } from "./components/layout/AppLayout";
import { TaskList } from "./components/features/TaskList";
import { AuthPage } from "./components/features/AuthPage";
import { useProjectsContext } from "./context/ProjectsContext";

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

// Компонент самого приложения
function ProtectedApp() {
  return (
    <ProjectsProvider>
      <TasksWrapper>
        <AppLayout>
          <TaskList />
        </AppLayout>
      </TasksWrapper>
    </ProjectsProvider>
  );
}
// export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated, loading } = useAuthState();
//   const location = useLocation();

//   if (loading) return <div>Loading...</div>; // Или спиннер

//   if (!isAuthenticated) {
//     // Передаем текущий location в state, чтобы Navigate знал, куда вернуться
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return <>{children}</>;
// };
// Вспомогательный компонент для защиты роутов
function AppContent() {
  const { isAuthenticated, loading } = useAuthState();
  const location = useLocation();

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#111] text-white">
        Loading...
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

import { ProjectsProvider } from "./context/ProjectsContext";
import { TasksProvider } from "./context/TasksContext";
import { AppLayout } from "./components/layout/AppLayout";
import { TaskList } from "./components/features/TaskList";
import { useAuthState } from "./context/AuthContext";
import { AuthProvider } from "./context/AuthContext";
// src/App.tsx
import { AuthForm } from "./components/features/AuthForm";
import { useProjectsContext } from "./context/ProjectsContext";

function TasksWrapper({ children }: { children: React.ReactNode }) {
  // Достаем актуальное состояние из ProjectsProvider
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

// 1. Создаем внутренний компонент, который будет потреблять данные
function AppContent() {
  const { isAuthenticated, loading } = useAuthState();

  if (loading) return <div>Загрузка...</div>;

  return (
    <>
      {isAuthenticated ? (
        <ProjectsProvider>
          <TasksWrapper>
            <AppLayout>
              <TaskList />
            </AppLayout>
          </TasksWrapper>
        </ProjectsProvider>
      ) : (
        <AuthForm />
      )}
    </>
  );
}

// 2. Главный App только оборачивает всё в провайдер
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

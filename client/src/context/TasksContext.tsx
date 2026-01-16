// src/context/TasksContext.tsx

import { createContext, useContext, useMemo } from "react";
import { useTasks } from "../hooks/useTasks";

// 1. Контекст только для данных
const TasksStateContext = createContext<any>(null);
const TasksActionsContext = createContext<any>(null);

export function TasksProvider({ children }: any) {
  const { tasks, loading, createTask, deleteTask, updateTask, updateDone } =
    useTasks("у0209у-2");

  // Оборачиваем методы в useCallback, чтобы ссылки на них были стабильны
  const actions = useMemo(
    () => ({
      createTask,
      deleteTask,
      updateTask,
      updateDone,
    }),
    [createTask, deleteTask, updateTask, updateDone]
  );

  const state = useMemo(() => ({ tasks, loading }), [tasks, loading]);

  return (
    <TasksStateContext.Provider value={state}>
      <TasksActionsContext.Provider value={actions}>
        {children}
      </TasksActionsContext.Provider>
    </TasksStateContext.Provider>
  );
}

// Кастомные хуки для удобного доступа
export const useTasksState = () => {
  const context = useContext(TasksStateContext);
  if (!context)
    throw new Error("useTasksState must be used within TasksProvider");
  return context;
};

export const useTasksActions = () => {
  const context = useContext(TasksActionsContext);
  if (!context)
    throw new Error("useTasksActions must be used within TasksProvider");
  return context;
};

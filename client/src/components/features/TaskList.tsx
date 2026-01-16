import { useState } from "react";
import { useTasksActions } from "../../context/TasksContext";
import { TaskForm } from "./TaskForm";
import { TaskCard } from "./TaskCard";
import { useFilteredTasks } from "../../hooks/useFilteredTasks";
import { ConfirmModal } from "../ui/ConfirmModal";
import { AddTaskBtn } from "../ui/AddTaskBtn";
import { EmptyState } from "../ui/EmptyPage";
import { useProjectsContext } from "../../context/ProjectsContext";
import type { Task } from "../../types/tasks";

// TaskList.tsx
export const TaskList = () => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const { mode } = useProjectsContext();
  const { tasks, ready } = useFilteredTasks();
  const { deleteTask, updateTask, createTask } = useTasksActions();

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-[870px] p-4">
      <div className="tasks ">
        {tasks.map((task: Task) => (
          <div key={task.id}>
            <TaskCard
              task={task}
              isEditing={editingTaskId === task.id}
              onEdit={() => setEditingTaskId(task.id)}
              onDeleteRequest={() => setTaskToDelete(task)}
            />
            {editingTaskId === task.id && (
              <TaskForm
                initiaTask={task}
                formMode="edit"
                onClose={() => {
                  setEditingTaskId(null);
                  setOpenForm(false);
                }}
                onSubmit={async (data) => {
                  await updateTask(task.id, data);
                  setEditingTaskId(null);
                }}
              />
            )}
          </div>
        ))}
      </div>

      {taskToDelete && (
        <ConfirmModal
          title="Delete Task"
          variant="primary"
          message={
            <>
              Task <b>"{taskToDelete.title}"</b> will be gone forever.
            </>
          }
          onConfirm={async () => {
            await deleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }}
          onClose={() => setTaskToDelete(null)}
          confirmText="Delete Now"
        />
      )}
      {openForm && !editingTaskId && (
        <TaskForm
          formMode="create"
          onClose={() => {
            setOpenForm(false);
          }}
          onSubmit={async (data) => {
            await createTask(data);
          }}
        />
      )}

      {!openForm && tasks.length !== 0 && mode !== "completed" && (
        <AddTaskBtn
          onOpenForm={() => {
            setOpenForm(true);
            setEditingTaskId(null);
          }}
        />
      )}

      {!openForm && tasks.length === 0 && (
        <EmptyState mode={mode} onOpenForm={() => setOpenForm(true)} />
      )}
    </div>
  );
};

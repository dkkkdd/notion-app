import { useEffect, useState } from "react";
import { useTasksActions } from "../../context/TasksContext";
import { TaskForm } from "./TaskForm";
import { TaskCard } from "./TaskCard";
import { useFilteredTasks } from "../../hooks/useFilteredTasks";
import { ConfirmModal } from "../ui/ConfirmModal";
import { AddTaskBtn } from "../ui/AddTaskBtn";
import { EmptyState } from "../ui/EmptyPage";
import { useProjectsContext } from "../../context/ProjectsContext";
import type { Task } from "../../types/tasks";
import { GlobalMenuController } from "./GeneralMenu";
import { ProjectMenuController } from "./ProjectMenu";
import { useProjectMenu } from "./ProjectMenu";
import { Trans, useTranslation } from "react-i18next";
import { Selector } from "./Selector";
import { useTaskSelection } from "../../hooks/useTaskSelection";

export const TaskList = () => {
  const { tasks, ready } = useFilteredTasks();
  const { t } = useTranslation();
  const { mode, selectedProjectId } = useProjectsContext();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(
    {}
  );

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: prev[taskId] === false ? true : false,
    }));
  };
  const { deleteTask, updateTask, createTask } = useTasksActions();
  const {
    selectionMode,
    setSelectionMode,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    bulkComplete,
    total,
    bulkUpdateDeadline,
    bulkDelete,
    openPrioritySheet,
  } = useTaskSelection();

  const handleStartEditing = (id: string) => {
    setEditingTaskId(id);
    setActiveParentId(null);
    setOpenForm(false);
  };

  const handleStartAddSubtask = (parentId: string) => {
    setActiveParentId(parentId);
    setEditingTaskId(null);
    setOpenForm(false);
  };

  const handleStartCreateRoot = () => {
    setOpenForm(true);
    setEditingTaskId(null);
    setActiveParentId(null);
  };
  const [globalMenuAnchor, setGlobalMenuAnchor] = useState<HTMLElement | null>(
    null
  );
  useEffect(() => {
    if (selectionMode) {
      setOpenForm(false);
      setActiveParentId(null);
      setEditingTaskId(null);
    }
  }, [selectionMode]);

  const menu = useProjectMenu();
  if (!ready) return null;

  return (
    <div className="mx-auto max-w-[870px] p-4">
      {mode !== "completed" && (
        <div className="flex fixed top-2 right-2">
          <button
            className="!ml-auto !inline-flex absolute top-5 right-5 cursor-pointer flex items-center justify-center leading-none bg-transparent p-[0.3em] rounded-[8px] hover:bg-black/5 dark:hover:bg-[#82828241] text-black dark:text-white transition-colors"
            onClick={(e) => {
              if (selectedProjectId) {
                menu.open(e.currentTarget, selectedProjectId);
              } else {
                setGlobalMenuAnchor(e.currentTarget);
              }
            }}
          >
            <span className="icon-three-dots-punctuation-sign-svgrepo-com rotate-[90deg] text-[1.3em]" />
          </button>
        </div>
      )}

      <ProjectMenuController
        anchor={menu.anchor}
        onSelect={() => setSelectionMode(true)}
        projectId={menu.projectId}
        onClose={menu.close}
        onReset={menu.reset}
      />

      <GlobalMenuController
        anchor={globalMenuAnchor}
        onSelect={() => setSelectionMode(true)}
        mode={mode}
        onClose={() => setGlobalMenuAnchor(null)}
      />

      <div className="tasks flex flex-col">
        {tasks.map((task: any) => (
          <div key={task.id} className="task-group flex flex-col">
            {editingTaskId === task.id ? (
              <TaskForm
                initiaTask={task}
                formMode="edit"
                onClose={() => setEditingTaskId(null)}
                onSubmit={async (data) => {
                  await updateTask(task.id, data);
                  setEditingTaskId(null);
                }}
              />
            ) : (
              <TaskCard
                task={task}
                isEditing={false}
                showSubTasks={
                  mode === "today" ? false : expandedTasks[task.id] !== false
                }
                selectionMode={selectionMode}
                selected={selectedIds.has(task.id)}
                onSelect={() => toggleSelect(task.id)}
                setShowSubTasks={() => toggleTask(task.id)}
                onEdit={() => handleStartEditing(task.id)}
                onDeleteRequest={() => setTaskToDelete(task)}
                onAddSubtask={() => handleStartAddSubtask(task.id)}
              />
            )}

            {mode !== "today" && expandedTasks[task.id] !== false && (
              <div className="subtasks-container ml-8 pl-4 flex flex-col">
                {task.subtasks?.map((sub: any) => (
                  <div key={sub.id}>
                    {editingTaskId === sub.id ? (
                      <TaskForm
                        initiaTask={sub}
                        formMode="edit"
                        onClose={() => setEditingTaskId(null)}
                        onSubmit={async (data) => {
                          await updateTask(sub.id, data);
                          setEditingTaskId(null);
                        }}
                      />
                    ) : (
                      <TaskCard
                        task={sub}
                        selectionMode={selectionMode}
                        selected={selectedIds.has(sub.id)}
                        onSelect={() => toggleSelect(sub.id)}
                        isEditing={false}
                        onEdit={() => handleStartEditing(sub.id)}
                        onDeleteRequest={() => setTaskToDelete(sub)}
                      />
                    )}
                  </div>
                ))}

                {activeParentId === task.id && (
                  <TaskForm
                    formMode="create"
                    parentId={task.id}
                    onClose={() => setActiveParentId(null)}
                    onSubmit={async (data) => {
                      await createTask({ ...data, parentId: task.id });
                      setActiveParentId(null);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {taskToDelete && (
        <ConfirmModal
          title={t("delete_task_title")}
          variant="primary"
          message={
            <Trans
              i18nKey="delete_task_message"
              values={{ title: taskToDelete.title }}
              components={{
                b: <b className="font-bold text-black dark:text-white" />,
              }}
            />
          }
          onConfirm={async () => {
            await deleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }}
          onClose={() => setTaskToDelete(null)}
          confirmText={t("delete_now")}
          cancelText={t("cancel")}
        />
      )}

      {openForm && (
        <TaskForm
          formMode="create"
          onClose={() => setOpenForm(false)}
          onSubmit={async (data) => {
            await createTask(data);
          }}
        />
      )}

      {!openForm &&
        tasks.length !== 0 &&
        mode !== "completed" &&
        mode !== "overdue" && <AddTaskBtn onOpenForm={handleStartCreateRoot} />}

      {!openForm && tasks.length === 0 && (
        <EmptyState mode={mode} onOpenForm={() => setOpenForm(true)} />
      )}

      <Selector
        visible={selectionMode}
        total={total}
        selectedIds={selectedIds}
        toggleSelectAll={toggleSelectAll}
        onClear={clearSelection}
        onComplete={() => bulkComplete([...selectedIds])}
        onDelete={() => bulkDelete([...selectedIds])}
        onUpdateDeadline={(d: any, t: any) =>
          bulkUpdateDeadline([...selectedIds], d, t)
        }
        onSetPriority={(p: any) => openPrioritySheet([...selectedIds], p)}
      />
    </div>
  );
};

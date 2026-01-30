import { useEffect, useState } from "react";
import { useTasksActions } from "../../context/TasksContext";
import { TaskForm } from "./TaskForm";
import { TaskCard } from "./TaskCard";
import { useFilteredTasks } from "../../hooks/useFilteredTasks";
import { ConfirmModal } from "../ConfirmModal";
import { AddTaskBtn } from "../AddTaskBtn";
import { EmptyState } from "../EmptyPage";
import { useProjectsContext } from "../../context/ProjectsContext";
import type { Task } from "../../types/tasks";
import { Trans, useTranslation } from "react-i18next";
import { Selector } from "../Selector";
import { useTaskSelection } from "../../hooks/useTaskSelection";
import { useIsMobile } from "../../hooks/useIsMobile";
import { TaskListMenu } from "./TaskListMenu";

export const TaskList = () => {
  const isMobile = useIsMobile();

  const { tasks, ready } = useFilteredTasks();
  const { t } = useTranslation();
  const { mode, selectedProjectId } = useProjectsContext();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(
    {},
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
  } = useTaskSelection(tasks);

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

  useEffect(() => {
    if (selectionMode) {
      setOpenForm(false);
      setActiveParentId(null);
      setEditingTaskId(null);
    }
  }, [selectionMode]);
  const shouldShowAddButton =
    !openForm &&
    mode !== "completed" &&
    mode !== "overdue" &&
    (isMobile || tasks.length > 0);
  if (!ready) return null;

  return (
    <>
      <TaskListMenu
        mode={mode}
        selectedProjectId={selectedProjectId}
        onStartSelection={() => setSelectionMode(true)}
      />

      <div className=" w-full max-w-[58rem] mx-auto pt-20">
        {tasks.map((task: Task) => (
          <div key={task.id} className="task-group flex flex-col  ">
            {editingTaskId === task.id ? (
              <TaskForm
                openForm={true}
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
                isMobile={isMobile}
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
              <div className="subtasks-container pl-9 flex flex-col">
                {task.subtasks?.map((sub: Task) => (
                  <div key={sub.id}>
                    {editingTaskId === sub.id ? (
                      <TaskForm
                        openForm={true}
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
                        isMobile={isMobile}
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
                    openForm={true}
                    formMode="create"
                    parentId={task.id}
                    onClose={() => setActiveParentId(null)}
                    onSubmit={async (data) => {
                      await createTask({ ...data, parentId: task.id });
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
        {shouldShowAddButton && (
          <div className="fixed bottom-[10%] md:static">
            <AddTaskBtn
              showText={isMobile ? false : true}
              onOpenForm={handleStartCreateRoot}
            />
          </div>
        )}
        {openForm && (
          <TaskForm
            openForm={openForm}
            formMode="create"
            onClose={() => setOpenForm(false)}
            onSubmit={async (data) => {
              await createTask(data);
            }}
          />
        )}
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
        onUpdateDeadline={(date: string | null, time: string | null) =>
          bulkUpdateDeadline([...selectedIds], date, time)
        }
        onSetPriority={(p: number) => openPrioritySheet([...selectedIds], p)}
      />
    </>
  );
};

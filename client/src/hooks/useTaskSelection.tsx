import { useMemo, useState } from "react";
import { useTasksActions, useTasksState } from "../context/TasksContext";

export function useTaskSelection() {
  const { tasks } = useTasksState();
  const { updateTask, deleteTask } = useTasksActions();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const allIds = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t: any) => {
      set.add(t.id);
      t.subtasks?.forEach((s: any) => set.add(s.id));
    });
    return set;
  }, [tasks]);
  const total = tasks.reduce(
    (acc: any, t: any) => acc + 1 + (t.subtasks?.length || 0),
    0
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const isAllSelected = prev.size === allIds.size;
      return isAllSelected ? new Set() : allIds;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  const buildDeadline = (date: string, time?: string) => {
    const d = new Date(date);

    if (time) {
      const [h, m] = time.split(":").map(Number);
      d.setHours(h, m, 0, 0);
    } else {
      d.setHours(23, 59, 59, 999);
    }

    return d.toISOString();
  };

  const bulkComplete = async (ids: string[]) => {
    await Promise.all(ids.map((id) => updateTask(id, { isDone: true })));
    clearSelection();
  };

  const bulkUpdateDeadline = async (
    ids: string[],
    newDate: string | null,
    newTime: string
  ) => {
    const deadline = newDate ? buildDeadline(newDate, newTime) : null;
    const reminderAt = newDate ? newTime : null;

    await Promise.all(
      ids.map((id) =>
        updateTask(id, {
          deadline,
          reminderAt,
        })
      )
    );

    clearSelection();
  };

  const bulkDelete = async (ids: string[]) => {
    await Promise.all(ids.map((id) => deleteTask(id)));
    clearSelection();
  };

  const openPrioritySheet = async (ids: string[], priority: number) => {
    await Promise.all(ids.map((id) => updateTask(id, { priority })));
    clearSelection();
  };

  return {
    selectionMode,
    setSelectionMode,
    selectedIds,
    total,
    toggleSelect,
    toggleSelectAll,
    clearSelection,

    bulkComplete,
    bulkUpdateDeadline,
    bulkDelete,
    openPrioritySheet,
  };
}

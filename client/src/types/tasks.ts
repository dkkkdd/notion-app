export interface Task {
  id: string;
  title: string;
  isDone: boolean;
  order: number;
  priority: number;

  parentId?: string | null;
  comment: string | null;
  deadline: string | null;
  reminderAt?: string | null;
  userId: string;
  projectId?: string | null;
  completedAt: Date | null | undefined;

  sectionId?: string | null;
  _count?: { tasks: number };
}

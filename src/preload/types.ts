type Subtask = {
  id: number
  title: string
  isDone: 1 | 0
}

type Task = {
  id: number
  title: string
  date: string | null
  notes: string | null
  isImportant: 1 | 0
  isDone: 1 | 0
  createdAt: number
  subtasks: Subtask[]
}

type TaskData = {
  title: string
  date: string | null
  notes: string | null
  isImportant: 1 | 0
  isDone: 1 | 0
  createdAt: number
}

export type MainApi = {
  getAllTasks: () => Promise<Task[]>
  insertTask: (data: TaskData) => Promise<Task | null>
  updateTaskImportance: (taskId: number, isImportant: 1 | 0) => Promise<void>
  updateTaskStatus: (taskId: number, isDone: 1 | 0) => Promise<void>
  updateTaskDate: (taskId: number, date: string | null) => Promise<void>
  updateTaskNotes: (taskId: number, notes: string | null) => Promise<void>
  deleteTask: (taskId: number) => Promise<void>
  insertSubtask: (taskId: number, title: string) => Promise<Subtask | null>
  updateSubtask: (subtaskId: number, isDone: 1 | 0) => Promise<void>
  deleteSubtask: (subtaskId: number) => Promise<void>
}

export type TaskRow = {
  taskId: number
  title: string
  date: string | null
  notes: string | null
  isImportant: 1 | 0
  isDone: 1 | 0
  createdAt: number
}

export type SubtaskRow = {
  subtaskId: number
  title: string
  isDone: 1 | 0
  taskId: number
}

export type Subtask = {
  id: number
  title: string
  isDone: 1 | 0
}

export type Task = {
  id: number
  title: string
  date: string | null
  notes: string | null
  isImportant: 1 | 0
  isDone: 1 | 0
  createdAt: number
  subtasks: Subtask[]
}

export type TaskData = {
  date?: string | null
  notes?: string | null
  isImportant?: 1 | 0
  isDone?: 1 | 0
}

export type TaskRowData = {
  title: string
  date: string | null
  notes: string | null
  isImportant: 1 | 0
  isDone: 1 | 0
  createdAt: number
}

export type SubtaskData = {
  title: string
  taskId: number
}

export type SubtaskRowData = {
  id: number
  title: string
  isDone: 1 | 0
}

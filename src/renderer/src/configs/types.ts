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

export type SubTask = {
  title: string
  isDone: boolean
}

export type Task = {
  id: number
  title: string
  date: string | null
  notes: string | null
  isImportant: boolean
  isDone: boolean
  subtasks: SubTask[] | null
  createdAt: Date
}

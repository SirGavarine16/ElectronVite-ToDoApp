import { create } from 'zustand'

import { Subtask, Task } from '@renderer/configs'
// import dayjs from 'dayjs'

type AppStore = {
  selectedCategory: number
  setSelectedCategory: (index: number) => void
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  isTaskOpen: boolean
  toggleTask: () => void
  selectedTask: number | null
  setSelectedTask: (taskId: number | null) => void
  deleteTask: (taskId: number) => void
  toggleTaskImportance: (taskId: number, isImportant: 1 | 0) => void
  isTaskSubmitOpen: boolean
  toggleTaskSubmit: () => void
  updateTaskStatus: (taskId: number, isDone: 1 | 0) => void
  addTask: (task: Task) => void
  updateTaskNotes: (taskId: number, notes: string | null) => void
  updateTaskDate: (taskId: number, date: string | null) => void
  addSubtask: (taskId: number, subtask: Subtask) => void
  updateSubtask: (taskId: number, subtaskId: number, isDone: 1 | 0) => void
  deleteSubtask: (taskId: number, subtaskId: number) => void
}

const useAppStore = create<AppStore>((set) => ({
  tasks: [],
  setTasks: (tasks): void => set((state) => ({ ...state, tasks })),
  selectedCategory: 2,
  setSelectedCategory: (index): void => set((state) => ({ ...state, selectedCategory: index })),
  isTaskOpen: false,
  toggleTask: (): void => set((state) => ({ ...state, isTaskOpen: !state.isTaskOpen })),
  selectedTask: null,
  setSelectedTask: (taskId): void => set((state) => ({ ...state, selectedTask: taskId })),
  deleteTask: (taskId): void =>
    set((state) => ({ ...state, tasks: state.tasks.filter(({ id }) => id !== taskId) })),
  toggleTaskImportance: (taskId: number, isImportant): void =>
    set((state) => ({
      ...state,
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, isImportant } : task))
    })),
  isTaskSubmitOpen: false,
  toggleTaskSubmit: (): void =>
    set((state) => ({ ...state, isTaskSubmitOpen: !state.isTaskSubmitOpen })),
  updateTaskStatus: (taskId, isDone): void =>
    set((state) => ({
      ...state,
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, isDone } : task))
    })),
  addTask: (newTask): void => set((state) => ({ ...state, tasks: [...state.tasks, newTask] })),
  updateTaskNotes: (taskId, notes): void =>
    set((state) => ({
      ...state,
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, notes } : task))
    })),
  updateTaskDate: (taskId, date): void =>
    set((state) => ({
      ...state,
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, date } : task))
    })),
  addSubtask: (taskId, subtask): void =>
    set((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, subtasks: [...task.subtasks, subtask] } : task
      )
    })),
  updateSubtask: (taskId, subtaskId, isDone): void =>
    set((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, isDone } : subtask
              )
            }
          : task
      )
    })),
  deleteSubtask: (taskId, subtaskId): void =>
    set((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId) }
          : task
      )
    }))
}))

export default useAppStore

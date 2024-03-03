import { create } from 'zustand'

import { Task } from '@renderer/configs'
import dayjs from 'dayjs'

type AppStore = {
  selectedCategory: number
  setSelectedCategory: (index: number) => void
  isTaskSubmitOpen: boolean
  toggleTaskSubmit: () => void
  tasks: Task[]
  addTask: (label: Task) => void
  isTaskOpen: boolean
  toggleTask: () => void
  toggleTaskImportance: (taskId: number) => void
  toggleDailyTask: (taskId: number) => void
  updateTaskStatus: (taskId: number, status: boolean) => void
  updateTaskNote: (taskId: number, notes: string) => void
  addSubtask: (taskId: number, label: string) => void
  deleteSubtask: (taskId: number, subtaskIndex: number) => void
  deleteTask: (taskId: number) => void
  toggleSubtaskStatus: (taskId: number, subtaskIndex: number, status: boolean) => void
  selectedTask: number | null
  setSelectedTask: (taskId: number | null) => void
}

const useAppStore = create<AppStore>((set) => ({
  selectedCategory: 2,
  setSelectedCategory: (index): void => {
    set((state) => ({ ...state, selectedCategory: index }))
  },
  isTaskSubmitOpen: false,
  toggleTaskSubmit: (): void => {
    set((state) => ({ ...state, isTaskSubmitOpen: !state.isTaskSubmitOpen }))
  },
  tasks: [],
  addTask: (newTask): void => {
    set((state) => ({ ...state, tasks: [...state.tasks, newTask] }))
  },
  isTaskOpen: false,
  toggleTask: (): void => {
    set((state) => ({ ...state, isTaskOpen: !state.isTaskOpen }))
  },
  toggleTaskImportance: (taskId): void => {
    set((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, isImportant: !task.isImportant } : task
      )
    }))
  },
  toggleDailyTask: (taskId): void => {
    set((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, date: task.date ? null : dayjs().format('DD/MM/YYYY') }
          : task
      )
    }))
  },
  updateTaskStatus: (taskId, status): void => {
    set((state) => ({
      ...state,
      tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, isDone: status } : task))
    }))
  },
  updateTaskNote: (taskId, notes): void => {
    set((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, notes: notes.trim().length > 0 ? notes : null } : task
      )
    }))
  },
  addSubtask: (taskId, title): void => {
    set((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks
                ? [...task.subtasks, { title, isDone: false }]
                : [{ title, isDone: false }]
            }
          : task
      )
    }))
  },
  deleteSubtask: (taskId, subtaskIndex): void => {
    set((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks:
                task.subtasks && task.subtasks.length > 1
                  ? task.subtasks.filter((_, index) => index !== subtaskIndex)
                  : null
            }
          : task
      )
    }))
  },
  toggleSubtaskStatus: (taskId, subtaskIndex, isDone): void => {
    set((state) => ({
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks
                ? task.subtasks.map((subtask, index) =>
                    index === subtaskIndex ? { ...subtask, isDone } : subtask
                  )
                : null
            }
          : task
      )
    }))
  },
  deleteTask: (taskId): void => {
    set((state) => ({
      ...state,
      tasks: state.tasks.filter((task) => task.id !== taskId)
    }))
  },
  selectedTask: null,
  setSelectedTask: (taskId): void => {
    set((state) => ({ ...state, selectedTask: taskId }))
  }
}))

export default useAppStore

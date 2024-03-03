import dayjs from 'dayjs'
import { useMemo } from 'react'

import type { Task } from '@renderer/configs'
import useAppStore from './useAppStore'

type TasksStore = {
  allTasks: Task[]
  dailyTasks: Task[]
  importantTasks: Task[]
}

const useTasksStore = (): TasksStore => {
  const tasks = useAppStore((state) => state.tasks)

  const dailyTasks = useMemo(() => {
    return tasks.filter((task) => task.date && task.date === dayjs().format('DD/MM/YYYY'))
  }, [tasks])

  const importantTasks = useMemo(() => {
    return tasks.filter((task) => task.isImportant)
  }, [tasks])

  return {
    allTasks: tasks,
    dailyTasks,
    importantTasks
  }
}

export default useTasksStore

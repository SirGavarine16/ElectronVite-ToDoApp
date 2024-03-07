import { verbose } from 'sqlite3'
import type { Database, RunResult } from 'sqlite3'

import queries from './queries'
import { existsSync, mkdirSync } from 'fs'
import { DB_FOLDER_PATH, DB_PATH } from './configs'
import {
  SubtaskData,
  SubtaskRow,
  SubtaskRowData,
  Task,
  TaskData,
  TaskRow,
  TaskRowData
} from '../configs/types'

const sqlite3 = verbose()

let db: Database | null = null

const openDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (error) => {
      if (error) return reject(error)
      resolve()
    })
  })
}

const closeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db?.close((error) => {
      if (error) return reject(error)
      db = null
      resolve()
    })
  })
}

const createTasksTable = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db?.run(queries.createTaskTable, (result, error) => {
      if (error) return reject(error)
      resolve(result)
    })
  })
}

const createSubtaskTable = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db?.run(queries.createSubtaskTable, (result, error) => {
      if (error) return reject(error)
      resolve(result)
    })
  })
}

const getAllTasks = async (): Promise<TaskRow[]> => {
  return new Promise((resolve, reject) => {
    db?.all(queries.getTasks, [], (error, result: TaskRow[]) => {
      if (error) return reject(error)
      resolve(result)
    })
  })
}

const getTask = async (taskId: number): Promise<TaskRow> => {
  return new Promise((resolve, reject) => {
    db?.get(queries.getTask, [taskId], (error, result: TaskRow) => {
      if (error) return reject(error)
      resolve(result)
    })
  })
}

const insertTask = async ({
  title,
  date,
  notes,
  isImportant,
  isDone,
  createdAt
}: TaskRowData): Promise<TaskRow> => {
  return new Promise((resolve, reject) => {
    db?.run(
      queries.insertTask,
      [title, date, notes, isImportant, isDone, createdAt],
      async function (this: RunResult, error) {
        if (error) return reject(error)
        const task = await getTask(this.lastID)
        resolve(task)
      }
    )
  })
}

const updateTask = (taskId: number, data: TaskData): Promise<void> => {
  return new Promise((resolve, reject) => {
    getTask(taskId)
      .then((result) => {
        db?.run(
          queries.updateTask,
          [
            data.date !== undefined ? data.date : result.date,
            data.notes !== undefined ? data.notes : result.notes,
            data.isImportant !== undefined ? data.isImportant : result.isImportant,
            data.isDone !== undefined ? data.isDone : result.isDone,
            taskId
          ],
          function (this: RunResult, error) {
            if (error) return reject(error)
            resolve()
          }
        )
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const deleteTask = async (taskId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db?.run(queries.deleteTask, [taskId], function (this: RunResult, error) {
      if (error) return reject(error)
      db?.run(queries.deleteSubtasks, [taskId], function (this: RunResult, error) {
        if (error) return reject(error)
        resolve()
      })
    })
  })
}

const getAllSubtasks = async (): Promise<SubtaskRow[]> => {
  return new Promise((resolve, reject) => {
    db?.all(queries.getSubtasks, [], (error, result: SubtaskRow[]) => {
      if (error) return reject(error)
      resolve(result)
    })
  })
}

const getSubtask = async (subtaskId: number): Promise<SubtaskRow> => {
  return new Promise((resolve, reject) => {
    db?.get(queries.getSubtask, [subtaskId], (error, result: SubtaskRow) => {
      if (error) return reject(error)
      resolve(result)
    })
  })
}

const insertSubtask = async ({ title, taskId }: SubtaskData): Promise<SubtaskRow> => {
  return new Promise((resolve, reject) => {
    db?.run(queries.insertSubtask, [title, 0, taskId], async function (this: RunResult, error) {
      if (error) return reject(error)
      const subtask = await getSubtask(this.lastID)
      resolve(subtask)
    })
  })
}

const updateSubtask = async (subtaskId: number, isDone: 1 | 0): Promise<void> => {
  return new Promise((resolve, reject) => {
    db?.run(queries.updateSubtask, [isDone, subtaskId], function (this: RunResult, error) {
      if (error) return reject(error)
      resolve()
    })
  })
}

const deleteSubtask = async (subtaskId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db?.run(queries.deleteSubtask, [subtaskId], function (this: RunResult, error) {
      if (error) return reject(error)
      resolve()
    })
  })
}

export const setupDatabase = async (): Promise<void> => {
  try {
    if (!existsSync(DB_FOLDER_PATH)) mkdirSync(DB_FOLDER_PATH)
    await openDatabase()
    await createTasksTable()
    await createSubtaskTable()
    await closeDatabase()
  } catch (error) {
    console.log('Error in Database Setup')
  }
}

export const getAllTasksFromDatabase = async (): Promise<Task[]> => {
  try {
    await openDatabase()
    const tasks = await getAllTasks()
    const subtasks = await getAllSubtasks()
    await closeDatabase()

    console.log('TEST', tasks, subtasks)

    return tasks.map(({ taskId, ...task }) => ({
      id: taskId,
      subtasks: subtasks
        .filter((subtask) => subtask.taskId === taskId)
        .map(({ subtaskId, title, isDone }) => ({
          id: subtaskId,
          title,
          isDone
        })),
      ...task
    }))
  } catch (error) {
    console.log('Error in Tasks Fetch', error)
    return []
  }
}

export const deleteTaskFromDatabase = async (taskId: number): Promise<void> => {
  try {
    await openDatabase()
    await deleteTask(taskId)
    await closeDatabase()
  } catch (error) {
    console.log('Error in Task Delete', error)
  }
}

export const updateTaskInDatabase = async (taskId: number, data: TaskData): Promise<void> => {
  try {
    await openDatabase()
    await updateTask(taskId, data)
    await closeDatabase()
  } catch (error) {
    console.log('Error in Task Update', error)
  }
}

export const insertTaskInDatabase = async (data: TaskRowData): Promise<Task | null> => {
  try {
    await openDatabase()
    const { taskId, ...task } = await insertTask(data)
    await closeDatabase()
    return { id: taskId, subtasks: [], ...task }
  } catch (error) {
    console.log('Error in Task Insertion', error)
    return null
  }
}

export const insertSubtaskInDatabase = async (
  taskId: number,
  title: string
): Promise<SubtaskRowData | null> => {
  try {
    await openDatabase()
    const { subtaskId, ...subtask } = await insertSubtask({ title, taskId })
    await closeDatabase()
    return { id: subtaskId, title: subtask.title, isDone: subtask.isDone }
  } catch (error) {
    console.log('Error in Subtask Insertion', error)
    return null
  }
}

export const updateSubtaskInDatabase = async (subtaskId: number, isDone: 1 | 0): Promise<void> => {
  try {
    await openDatabase()
    await updateSubtask(subtaskId, isDone)
    await closeDatabase()
  } catch (error) {
    console.log('Error in Subtask Update', error)
  }
}

export const deleteSubtaskInDatabase = async (subtaskId: number): Promise<void> => {
  try {
    await openDatabase()
    await deleteSubtask(subtaskId)
    await closeDatabase()
  } catch (error) {
    console.log('Error in Subtask Delete', error)
  }
}

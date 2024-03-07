import { contextBridge, ipcRenderer } from 'electron'

import { MainApi } from './types'

// Custom APIs for renderer
const api: MainApi = {
  getAllTasks: () => ipcRenderer.invoke('get-tasks'),
  insertTask: (data) => ipcRenderer.invoke('add-task', data),
  updateTaskImportance: (taskId, isImportant) =>
    ipcRenderer.invoke('update-task-importance', taskId, isImportant),
  updateTaskStatus: (taskId, isDone) => ipcRenderer.invoke('update-task-status', taskId, isDone),
  updateTaskDate: (taskId, date) => ipcRenderer.invoke('update-task-date', taskId, date),
  updateTaskNotes: (taskId, notes) => ipcRenderer.invoke('update-task-notes', taskId, notes),
  deleteTask: (taskId) => ipcRenderer.invoke('delete-task', taskId),
  insertSubtask: (taskId, title) => ipcRenderer.invoke('add-subtask', taskId, title),
  updateSubtask: (subtaskId, isDone) => ipcRenderer.invoke('update-subtask', subtaskId, isDone),
  deleteSubtask: (subtaskId) => ipcRenderer.invoke('delete-subtask', subtaskId)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}

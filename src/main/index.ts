import { join } from 'path'
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import icon from '../../resources/icon.png?asset'
import {
  deleteSubtaskInDatabase,
  deleteTaskFromDatabase,
  getAllTasksFromDatabase,
  insertSubtaskInDatabase,
  insertTaskInDatabase,
  setupDatabase,
  updateSubtaskInDatabase,
  updateTaskInDatabase
} from './db'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    show: false,
    minWidth: 1000,
    minHeight: 600,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  setupDatabase()

  ipcMain.handle('get-tasks', async () => {
    const tasks = await getAllTasksFromDatabase()
    return tasks
  })

  ipcMain.handle('add-task', async (_, data) => {
    const task = await insertTaskInDatabase(data)
    return task
  })

  ipcMain.handle('delete-task', async (_, taskId) => {
    await deleteTaskFromDatabase(taskId)
  })

  ipcMain.handle('update-task-importance', async (_, taskId, isImportant) => {
    await updateTaskInDatabase(taskId, { isImportant })
  })

  ipcMain.handle('update-task-status', async (_, taskId, isDone) => {
    await updateTaskInDatabase(taskId, { isDone })
  })

  ipcMain.handle('update-task-date', async (_, taskId, date) => {
    await updateTaskInDatabase(taskId, { date })
  })

  ipcMain.handle('update-task-notes', async (_, taskId, notes) => {
    await updateTaskInDatabase(taskId, { notes })
  })

  ipcMain.handle('add-subtask', async (_, taskId, title) => {
    const subtask = await insertSubtaskInDatabase(taskId, title)
    return subtask
  })

  ipcMain.handle('update-subtask', async (_, subtaskId, isDone) => {
    await updateSubtaskInDatabase(subtaskId, isDone)
  })

  ipcMain.handle('delete-subtask', async (_, subtaskId) => {
    await deleteSubtaskInDatabase(subtaskId)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

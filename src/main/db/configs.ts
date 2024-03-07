import { join } from 'path'
import { app } from 'electron'

export const DB_FOLDER_PATH = join(app.getPath('documents'), 'todoapp')
export const DB_PATH = join(DB_FOLDER_PATH, 'todoapp.db')

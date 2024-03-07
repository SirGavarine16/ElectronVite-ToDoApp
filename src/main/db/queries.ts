const queries = {
  createTaskTable: [
    'CREATE TABLE IF NOT EXISTS tasks (',
    'taskId INTEGER PRIMARY KEY, ',
    'title TEXT NOT NULL, ',
    'date TEXT, ',
    'notes TEXT, ',
    'isImportant INTEGER NOT NULL, ',
    'isDone INTEGER NOT NULL, ',
    'createdAt INTEGER NOT NULL',
    ');'
  ].join(''),
  createSubtaskTable: [
    'CREATE TABLE IF NOT EXISTS subtasks (',
    'subtaskId INTEGER PRIMARY KEY, ',
    'title TEXT NOT NULL, ',
    'isDone INTEGER NOT NULL, ',
    'taskId INTEGER NOT NULL, ',
    'FOREIGN KEY (taskId) REFERENCES tasks (taskId) ON UPDATE CASCADE ON DELETE CASCADE',
    ');'
  ].join(''),
  getTasks: 'SELECT * FROM tasks;',
  getTask: 'SELECT * FROM tasks WHERE taskId = ?;',
  insertTask:
    'INSERT INTO tasks(title, date, notes, isImportant, isDone, createdAt) VALUES(?, ?, ?, ?, ?, ?);',
  updateTask: 'UPDATE tasks SET date = ?, notes = ?, isImportant = ?, isDone = ? WHERE taskId = ?;',
  deleteTask: 'DELETE FROM tasks WHERE taskId = ?;',
  getSubtasks: 'SELECT * FROM subtasks;',
  getSubtask: 'SELECT * FROM subtasks WHERE subtaskId = ?;',
  insertSubtask: 'INSERT INTO subtasks(title, isDone, taskId) VALUES(?, ?, ?);',
  updateSubtask: 'UPDATE subtasks SET isDone = ? WHERE subtaskId = ?;',
  deleteSubtask: 'DELETE FROM subtasks WHERE subtaskId = ?;',
  deleteSubtasks: 'DELETE FROM subtasks WHERE taskId = ?;'
}

export default queries

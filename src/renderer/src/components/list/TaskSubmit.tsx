import { ChangeEvent, FormEvent, useState } from 'react'
import { Input, Row, Typography } from 'antd'
import { BorderOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import { useAppStore } from '@renderer/hooks'

const TaskSubmit = (): JSX.Element => {
  const [taskLabel, setTaskLabel] = useState('')

  const { isTaskOpen, isTaskSubmitOpen, toggleTaskSubmit, addTask, selectedCategory } = useAppStore(
    (state) => state
  )

  const width = isTaskOpen ? '54.166666666666664%' : '79.16666666666666%'

  const blurTaskSubmit = (): void => {
    setTaskLabel('')
    toggleTaskSubmit()
  }

  const handleTaskLabelChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setTaskLabel(event.target.value)
  }

  const submitTask = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    try {
      const task = await window.api.insertTask({
        title: taskLabel,
        date: selectedCategory === 0 ? dayjs().format('DD/MM/YYYY') : null,
        notes: null,
        isImportant: selectedCategory === 1 ? 1 : 0,
        isDone: 0,
        createdAt: Date.now()
      })
      if (task) addTask(task)
    } catch (error) {
      console.log('Error adding task!', error)
    }

    blurTaskSubmit()
  }

  return (
    <Row className="task-submit__wrapper" style={{ width }}>
      <div className="task-submit__form-wrapper" onBlur={blurTaskSubmit}>
        {isTaskSubmitOpen ? (
          <div className="task-submit__form">
            <BorderOutlined />
            <form onSubmit={submitTask}>
              <Input
                placeholder="Write your next task"
                variant="borderless"
                autoFocus
                value={taskLabel}
                onChange={handleTaskLabelChange}
              />
            </form>
          </div>
        ) : (
          <div className="task-submit__form-button" onClick={toggleTaskSubmit}>
            <PlusOutlined />
            <Typography.Text className="task-submit__form-button-label">Add a task</Typography.Text>
          </div>
        )}
      </div>
    </Row>
  )
}

export default TaskSubmit

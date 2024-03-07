import { useMemo } from 'react'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import { Checkbox, Row, Typography } from 'antd'
import { FormOutlined, StarFilled, StarOutlined, SunOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import type { Task } from '@renderer/configs'
import { useAppStore } from '@renderer/hooks'

type TaskCardProps = {
  data: Task
}

const TaskCard = ({ data }: TaskCardProps): JSX.Element => {
  const {
    toggleTask,
    toggleTaskImportance,
    updateTaskStatus,
    isTaskOpen,
    selectedTask,
    setSelectedTask
  } = useAppStore((state) => state)

  const isDaily = useMemo(() => {
    return data.date && data.date === dayjs().format('DD/MM/YYYY')
  }, [data])

  const handleCardClick = (): void => {
    if (isTaskOpen && selectedTask && selectedTask !== data.id) {
      return setSelectedTask(data.id)
    }
    setSelectedTask(isTaskOpen ? null : data.id)
    toggleTask()
  }

  const handleCheckChange = async (event: CheckboxChangeEvent): Promise<void> => {
    try {
      const isDone = event.target.checked ? 1 : 0
      await window.api.updateTaskStatus(data.id, isDone)
      updateTaskStatus(data.id, isDone)
    } catch (error) {
      console.log('Error updating task status!', error)
    }
  }

  const handleImportantIconClick = async (): Promise<void> => {
    try {
      await window.api.updateTaskImportance(data.id, data.isImportant === 1 ? 0 : 1)
      toggleTaskImportance(data.id, data.isImportant === 1 ? 0 : 1)
    } catch (error) {
      console.log('Error updating task importance!', error)
    }
  }

  return (
    <Row className="task-card__wrapper">
      <div className="task-card__content-wrapper" onClick={handleCardClick}>
        <div className="task-card__data-wrapper">
          <Typography.Text strong>{data.title}</Typography.Text>
          <div className="task-card__extra-data-wrapper">
            {isDaily ? (
              <div>
                <Typography.Text>On</Typography.Text>
                <SunOutlined className="task-card__daily-icon" />
                <Typography.Text>My Day</Typography.Text>
              </div>
            ) : null}
            {data.subtasks.length > 0 ? (
              <div>
                {isDaily ? (
                  <Typography.Text className="task-card__extra-data-div">{'-'}</Typography.Text>
                ) : null}
                <Typography.Text>
                  {data.subtasks.filter((subtask) => subtask.isDone).length} of{' '}
                  {data.subtasks.length}
                </Typography.Text>
              </div>
            ) : null}
            {data.notes ? (
              <div>
                {isDaily || (data.subtasks && data.subtasks.length > 0) ? (
                  <Typography.Text className="task-card__extra-data-div">{'-'}</Typography.Text>
                ) : null}
                <FormOutlined />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="task-card__checkbox-wrapper">
        <Checkbox checked={Boolean(data.isDone)} onChange={handleCheckChange} />
      </div>
      <div className="task-card__star-wrapper">
        {data.isImportant ? (
          <StarFilled onClick={handleImportantIconClick} />
        ) : (
          <StarOutlined onClick={handleImportantIconClick} />
        )}
      </div>
    </Row>
  )
}

export default TaskCard

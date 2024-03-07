import { useMemo, useState } from 'react'
import { Row, Typography } from 'antd'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'

import TaskCard from './TaskCard'
import { useAppStore, useTasksStore } from '@renderer/hooks'

const TaskList = (): JSX.Element => {
  const [isCompletedListOpen, setCompletedListOpen] = useState(true)

  const { selectedCategory } = useAppStore((state) => state)
  const { allTasks, dailyTasks, importantTasks } = useTasksStore()

  const displayedTasks = useMemo(() => {
    if (selectedCategory === 0) {
      return dailyTasks
    }
    if (selectedCategory === 1) {
      return importantTasks
    }
    return allTasks
  }, [allTasks, dailyTasks, importantTasks, selectedCategory])

  const toggleCompletedList = (): void => {
    setCompletedListOpen((prev) => !prev)
  }

  return (
    <Row className="list__wrapper">
      {displayedTasks
        .filter((task) => !task.isDone)
        .map((task) => (
          <TaskCard key={task.id} data={task} />
        ))}
      {displayedTasks.filter((task) => task.isDone).length > 0 ? (
        <Row className="list__completed-wrapper">
          <Row className="list__completed-header-wrapper" onClick={toggleCompletedList}>
            {isCompletedListOpen ? (
              <CaretDownOutlined className="list__completed-header-icon" />
            ) : (
              <CaretRightOutlined className="list__completed-header-icon" />
            )}
            <Typography.Text>Completed tasks</Typography.Text>
          </Row>
          {isCompletedListOpen ? (
            <Row className="list__completed">
              {displayedTasks
                .filter((task) => task.isDone)
                .map((task) => (
                  <TaskCard key={task.id} data={task} />
                ))}
            </Row>
          ) : null}
        </Row>
      ) : null}
    </Row>
  )
}

export default TaskList

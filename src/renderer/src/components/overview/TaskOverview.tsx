import { FormEvent, useEffect, useState } from 'react'
import { Col, Typography, Row, Modal, Input, Checkbox } from 'antd'
import {
  BorderOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
  StarFilled,
  StarOutlined,
  SunOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { useAppStore } from '@renderer/hooks'

dayjs.extend(relativeTime)

const TaskOverview = (): JSX.Element => {
  const [isReadyToRender, setReadyToRender] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [isSubtaskInputFocused, setSubtaskInputFocused] = useState(false)
  const [subtaskLabel, setSubtaskLabel] = useState('')

  const {
    toggleTask,
    selectedTask,
    setSelectedTask,
    toggleTaskImportance,
    tasks,
    toggleDailyTask,
    deleteTask,
    updateTaskNote,
    addSubtask,
    deleteSubtask,
    toggleSubtaskStatus
  } = useAppStore((state) => state)

  const currentTask = tasks.find((task) => task.id === selectedTask) || null
  const isDaily: boolean = Boolean(
    currentTask && currentTask.date && currentTask.date === dayjs().format('DD/MM/YYYY')
  )

  useEffect(() => {
    setTimeout(() => {
      setReadyToRender(true)
    }, 150)
  }, [])

  useEffect(() => {
    if (currentTask) {
      setNotes(currentTask.notes || '')
    }
  }, [currentTask])

  const closeOverview = (): void => {
    setSelectedTask(null)
    toggleTask()
  }

  const handleImportantIconClick = (): void => {
    if (currentTask) {
      toggleTaskImportance(currentTask.id)
    }
  }

  const handleDailyClick = (): void => {
    if (currentTask) {
      toggleDailyTask(currentTask.id)
    }
  }

  const submitNotes = (): void => {
    if (currentTask) {
      updateTaskNote(currentTask.id, notes)
    }
  }

  const submitSubtask = (event: FormEvent): void => {
    event.preventDefault()
    if (currentTask) {
      addSubtask(currentTask.id, subtaskLabel)
    }
    setSubtaskLabel('')
  }

  const openModal = (): void => setModalOpen(true)
  const closeModal = (): void => setModalOpen(false)

  const deleteCurrentTask = (): void => {
    if (currentTask) {
      toggleTask()
      deleteTask(currentTask.id)
      setSelectedTask(null)
    }
  }

  if (!isReadyToRender || !currentTask) return <></>

  return (
    <>
      <Col span={6} className="task-overview__wrapper">
        <div className="task-overview__content-wrapper">
          <Row justify="end">
            <CloseOutlined onClick={closeOverview} />
          </Row>
          <Row className="task-overview__box task-overview__title-wrapper">
            <div>
              <Typography.Title level={2} className="task-overview__title">
                {currentTask.title}
              </Typography.Title>
              <div className="task-overview__title-icon-wrapper">
                {currentTask.isImportant ? (
                  <StarFilled onClick={handleImportantIconClick} />
                ) : (
                  <StarOutlined onClick={handleImportantIconClick} />
                )}
              </div>
            </div>
            <div className="task-overview__subtasks-wrapper">
              {currentTask.subtasks ? (
                <div className="task-overview__subtasks-list">
                  {currentTask.subtasks.map(({ title, isDone }, subtaskIndex) => (
                    <div key={subtaskIndex} className="task-overview__subtask-card">
                      <div>
                        <Checkbox
                          checked={isDone}
                          className="task-overview__subtask-card-check"
                          onChange={(e) =>
                            toggleSubtaskStatus(currentTask.id, subtaskIndex, e.target.checked)
                          }
                        />
                        <Typography.Text className="task-overview__subtask-card-label">
                          {title}
                        </Typography.Text>
                      </div>
                      <DeleteOutlined onClick={() => deleteSubtask(currentTask.id, subtaskIndex)} />
                    </div>
                  ))}
                </div>
              ) : null}
              <form onSubmit={submitSubtask}>
                <Input
                  prefix={isSubtaskInputFocused ? <BorderOutlined /> : <PlusOutlined />}
                  variant="borderless"
                  placeholder="Add subtask"
                  className="task-overview__subtasks-input"
                  onFocus={() => setSubtaskInputFocused(true)}
                  onBlur={() => setSubtaskInputFocused(false)}
                  value={subtaskLabel}
                  onChange={(e) => setSubtaskLabel(e.target.value)}
                />
              </form>
            </div>
          </Row>
          <Row className="task-overview__daily-wrapper">
            <div
              className={`task-overview__daily-content ${isDaily ? '' : 'task-overview__daily-content--clickable'}`}
              onClick={!isDaily ? handleDailyClick : undefined}
            >
              <SunOutlined className="task-overview__daily-icon" />
              <Typography.Text>{isDaily ? 'Added to My Day' : 'Add to My Day'}</Typography.Text>
            </div>
            {isDaily ? (
              <div className="task-overview__daily-close-button" onClick={handleDailyClick}>
                <CloseOutlined className="task-overview__daily-close-button-icon" />
              </div>
            ) : null}
          </Row>
          <Row className="task-overview__box task-overview__notes-wrapper">
            <Input.TextArea
              variant="borderless"
              placeholder="Add note"
              onBlur={submitNotes}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              autoSize
            />
          </Row>
          <Row className="task-overview__footer-wrapper">
            <Typography.Text className="task-overview__footer-text">
              Created {dayjs(currentTask.createdAt).fromNow()}
            </Typography.Text>
            <div onClick={openModal}>
              <DeleteOutlined />
            </div>
          </Row>
        </div>
      </Col>
      <Modal
        title="Delete task"
        open={isModalOpen}
        onOk={deleteCurrentTask}
        onCancel={closeModal}
        okText="Delete"
        width="20rem"
        closable={false}
        centered
      >
        <Typography.Text>{`"${currentTask.title}"`} will be permanently deleted.</Typography.Text>
      </Modal>
    </>
  )
}

export default TaskOverview

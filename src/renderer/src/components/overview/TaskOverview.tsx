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
import { CheckboxChangeEvent } from 'antd/es/checkbox'

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
    updateTaskDate,
    deleteTask,
    updateTaskNotes,
    addSubtask,
    updateSubtask,
    deleteSubtask
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

  const handleImportantIconClick = async (): Promise<void> => {
    if (currentTask) {
      try {
        await window.api.updateTaskImportance(currentTask.id, currentTask.isImportant === 1 ? 0 : 1)
        toggleTaskImportance(currentTask.id, currentTask.isImportant === 1 ? 0 : 1)
      } catch (error) {
        console.log('Error updating task importance!', error)
      }
    }
  }

  const updateCurrentDate = async (): Promise<void> => {
    if (currentTask) {
      const date = dayjs().format('DD/MM/YYYY')
      await window.api.updateTaskDate(currentTask.id, date)
      updateTaskDate(currentTask.id, date)
    }
  }

  const removeCurrentDate = async (): Promise<void> => {
    if (currentTask) {
      await window.api.updateTaskDate(currentTask.id, null)
      updateTaskDate(currentTask.id, null)
    }
  }

  const submitNotes = async (): Promise<void> => {
    if (currentTask) {
      try {
        const taskNotes = notes.trim().length > 0 ? notes.trim() : null
        await window.api.updateTaskNotes(currentTask.id, taskNotes)
        updateTaskNotes(currentTask.id, taskNotes)
      } catch (error) {
        console.log('Error updating task notes!', error)
      }
    }
  }

  const submitSubtask = async (event: FormEvent): Promise<void> => {
    event.preventDefault()
    if (currentTask) {
      try {
        const subtask = await window.api.insertSubtask(currentTask.id, subtaskLabel)
        if (subtask) addSubtask(currentTask.id, subtask)
      } catch (error) {
        console.log('Error adding subtask!', error)
      }
    }
    setSubtaskLabel('')
  }

  const openModal = (): void => setModalOpen(true)
  const closeModal = (): void => setModalOpen(false)

  const deleteCurrentTask = async (): Promise<void> => {
    if (currentTask) {
      toggleTask()
      try {
        await window.api.deleteTask(currentTask.id)
        deleteTask(currentTask.id)
      } catch (error) {
        console.log('Error deleting task!', error)
      }
      setSelectedTask(null)
    }
  }

  const handleSubtaskCheckClick = async (
    event: CheckboxChangeEvent,
    subtaskId: number
  ): Promise<void> => {
    if (currentTask) {
      try {
        const isDone = event.target.checked ? 1 : 0
        await window.api.updateSubtask(subtaskId, isDone)
        updateSubtask(currentTask.id, subtaskId, isDone)
      } catch (error) {
        console.log('Error updating subtask!', error)
      }
    }
  }

  const handleDeleteSubtaskClick = async (subtaskId: number): Promise<void> => {
    if (currentTask) {
      try {
        await window.api.deleteSubtask(subtaskId)
        deleteSubtask(currentTask.id, subtaskId)
      } catch (error) {
        console.log('Error deleting subtask!', error)
      }
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
                  {currentTask.subtasks.map(({ id, title, isDone }) => (
                    <div key={id} className="task-overview__subtask-card">
                      <div>
                        <Checkbox
                          checked={Boolean(isDone)}
                          className="task-overview__subtask-card-check"
                          onChange={(e) => handleSubtaskCheckClick(e, id)}
                        />
                        <Typography.Text className="task-overview__subtask-card-label">
                          {title}
                        </Typography.Text>
                      </div>
                      <DeleteOutlined onClick={() => handleDeleteSubtaskClick(id)} />
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
              onClick={!isDaily ? updateCurrentDate : undefined}
            >
              <SunOutlined className="task-overview__daily-icon" />
              <Typography.Text>{isDaily ? 'Added to My Day' : 'Add to My Day'}</Typography.Text>
            </div>
            {isDaily ? (
              <div className="task-overview__daily-close-button" onClick={removeCurrentDate}>
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

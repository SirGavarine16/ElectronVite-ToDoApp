import { useEffect } from 'react'
import { Col, Row } from 'antd'

import { useAppStore } from '@renderer/hooks'
import { Sidebar } from '@renderer/components/sidebar'
import { Header } from '@renderer/components/header'
import { TaskList, TaskSubmit } from '@renderer/components/list'
import { TaskOverview } from '@renderer/components/overview'

function App(): JSX.Element {
  const { isTaskOpen, setTasks, tasks } = useAppStore((state) => state)

  const fetchAllTasks = async (): Promise<void> => {
    try {
      const response = await window.api.getAllTasks()
      setTasks(response)
    } catch (error) {
      console.log('Error fetching tasks!', error)
      setTasks([])
    }
  }

  useEffect(() => {
    fetchAllTasks()
  }, [])

  useEffect(() => {
    console.log('TASKS =>', tasks)
  }, [tasks])

  return (
    <>
      <Row className="app__wrapper">
        <Sidebar />
        <Col span={isTaskOpen ? 13 : 19} className="main-content__wrapper">
          <Header />
          <TaskList />
          <TaskSubmit />
        </Col>
        {isTaskOpen ? <TaskOverview /> : null}
      </Row>
    </>
  )
}

export default App

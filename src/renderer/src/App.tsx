import { useEffect } from 'react'
import { Col, Row } from 'antd'

import { useAppStore } from '@renderer/hooks'
import { Sidebar } from './components/sidebar'
import { Header } from './components/header'
import { TaskList, TaskSubmit } from './components/list'
import { TaskOverview } from './components/overview'

function App(): JSX.Element {
  const { isTaskOpen, tasks } = useAppStore((state) => state)

  useEffect(() => {
    console.log('Update!', tasks)
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

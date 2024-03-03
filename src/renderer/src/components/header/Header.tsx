import { Row, Typography } from 'antd'

import { useAppStore, useTaskCategories } from '@renderer/hooks'

const Header = (): JSX.Element => {
  const { isTaskOpen, selectedCategory } = useAppStore((state) => state)
  const TaskCategories = useTaskCategories()

  const width = isTaskOpen ? '54.166666666666664%' : '79.16666666666666%'

  return (
    <Row className="list__header-wrapper" style={{ width }}>
      <div className="list__header">
        <Typography.Title level={2} className="list__header-title">
          {TaskCategories[selectedCategory].label || 'Undefined'}
        </Typography.Title>
      </div>
    </Row>
  )
}

export default Header

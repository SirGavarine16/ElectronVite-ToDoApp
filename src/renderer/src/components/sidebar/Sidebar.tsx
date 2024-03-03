import { Badge, Col, Divider, Row, Typography } from 'antd'

import AppLogo from '@renderer/public/logo.avif'
import { useAppStore, useTaskCategories } from '@renderer/hooks'

const Sidebar = (): JSX.Element => {
  const { selectedCategory, setSelectedCategory } = useAppStore((state) => state)
  const TaskCategories = useTaskCategories()

  return (
    <Col span={5} className="sidebar__wrapper">
      <div className="sidebar__content-wrapper">
        <Row className="sidebar__logo-wrapper">
          <img src={AppLogo} alt="To Do Logo" className="sidebar__logo" />
        </Row>
        <Typography.Title className="sidebar__title">To Do App</Typography.Title>
        <Row className="sidebar__category-wrapper">
          {TaskCategories.map(({ icon, label, count }, categoryIndex) => (
            <Row
              key={categoryIndex}
              className={`sidebar__category ${selectedCategory === categoryIndex ? 'sidebar__category--selected' : ''}`}
              onClick={() => setSelectedCategory(categoryIndex)}
            >
              <Col>
                {icon}
                <Typography.Text className="sidebar__category-label">{label}</Typography.Text>
              </Col>
              <Col>
                {count > 0 ? (
                  <Badge count={count} color="#a62038" className="sidebar__badge" />
                ) : null}
              </Col>
            </Row>
          ))}
        </Row>
        <Divider />
      </div>
    </Col>
  )
}

export default Sidebar

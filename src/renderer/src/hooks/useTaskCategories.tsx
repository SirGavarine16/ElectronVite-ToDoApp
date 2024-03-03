import { ProfileOutlined, StarOutlined, SunOutlined } from '@ant-design/icons'

import useTasksStore from './useTasksStore'

type TaskCategory = {
  label: string
  icon: JSX.Element
  count: number
}

const useTaskCategories = (): TaskCategory[] => {
  const { allTasks, dailyTasks, importantTasks } = useTasksStore()

  return [
    {
      label: 'My Day',
      icon: <SunOutlined />,
      count: dailyTasks.length
    },
    {
      label: 'Important',
      icon: <StarOutlined />,
      count: importantTasks.length
    },
    {
      label: 'All Tasks',
      icon: <ProfileOutlined />,
      count: allTasks.length
    }
  ]
}

export default useTaskCategories

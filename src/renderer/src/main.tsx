import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'

import App from './App'
import { MainTheme } from './configs'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider theme={MainTheme}>
    <App />
  </ConfigProvider>
)

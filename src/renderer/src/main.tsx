import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'

import App from './App'
import { MainTheme } from './configs'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider theme={MainTheme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
)

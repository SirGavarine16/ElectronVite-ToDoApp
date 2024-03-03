import { ThemeConfig } from 'antd/es/config-provider/context'

const MainTheme: ThemeConfig = {
  token: {
    colorPrimary: '#a62038',
    colorBgBase: '#a62038',
    colorTextHeading: 'white',
    colorText: 'white',
    colorSplit: '#313131'
  },
  components: {
    Button: {
      primaryShadow: 'none',
      defaultBg: '#2c2c2c',
      defaultActiveBg: '#2c2c2c',
      defaultHoverBg: '#2c2c2c',
      defaultBorderColor: '#2c2c2c',
      defaultActiveColor: 'white',
      defaultHoverBorderColor: 'white',
      defaultHoverColor: 'white'
    },
    Input: {
      colorTextPlaceholder: '#414141'
    },
    Modal: {
      colorBgBase: 'thistle'
    }
  }
}

export default MainTheme

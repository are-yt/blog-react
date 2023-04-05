import React from 'react'
import { observer } from 'mobx-react-lite'
import RouterConfig from './components/RouterConfig'
import GlobalSpin from './components/GlobalSpin'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ToolAside from './components/ToolAside'
import Login from './components/Login'
import MessageApi from './components/MessageApi'
import { ConfigProvider, message } from 'antd'
import themeStore from './store/theme.Store'
import appStore from './store/app.Store'
message.config({
  maxCount: 3
})
const App = function () {
  const themeConfig = themeStore.themeConfig.toJS()
  const currentBgColor = themeStore.currentBgColor
  const isLogin = appStore.isLogin
  const isShowFooter = appStore.isShowFooter
  return (
    <ConfigProvider theme={themeConfig}>
      <div
        id="app"
        style={{
          background: currentBgColor,
          paddingBottom: isShowFooter ? 150 : 0
        }}
      >
        {/* 全局导航栏 */}
        <Navbar />
        {/* 全局加载组件 */}
        <GlobalSpin />
        {/* 路由表配置 */}
        <RouterConfig />
        {/* Footer */}
        {isShowFooter && <Footer />}
        {/* 边栏工具 */}
        <ToolAside />
        {/* 登录框 */}
        {isLogin && <Login />}
        {/* 全局消息组件 */}
        <MessageApi />
      </div>
    </ConfigProvider>
  )
}
export default observer(App)

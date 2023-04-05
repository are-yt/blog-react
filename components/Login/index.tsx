import React, { useMemo, useState, useCallback } from 'react'
import { Tabs, Modal } from 'antd'
import appStore from '../../store/app.Store'
import LoginPanel from './login'
import CodePanel from './code'
import ForgetPanel from './forget'
import RegisterPanel from './register'
import './index.scss'
function Login() {
  const [open] = useState(true)
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const changeTab = useCallback((key: string) => {
    const index = items.findIndex(item => item.key === key)
    setCurrentTabIndex(index)
  }, [])
  const changeLogin = useCallback(() => {
    setCurrentTabIndex(0)
  }, [])
  const handleCancel = useCallback(() => {
    appStore.changeLoginState(false)
  }, [])
  const items = useMemo(() => {
    return [
      {
        key: 'login',
        label: '登录',
        children: <LoginPanel type="password" close={handleCancel} />
      },
      {
        key: 'code',
        label: '验证码登录',
        children: <CodePanel type="code" close={handleCancel} />
      },
      {
        key: 'findpassword',
        label: '找回密码',
        children: <ForgetPanel changeLogin={changeLogin} />
      }
      // 注册和登录后台接口写成一个了
      // {
      //   key: 'registor',
      //   label: '注册',
      //   children: <RegisterPanel changeLogin={changeLogin} />
      // }
    ]
  }, [])
  return (
    <div id="login">
      <Modal
        title={items[currentTabIndex].label}
        open={open}
        onCancel={handleCancel}
        footer={null}
      >
        <Tabs
          items={items}
          activeKey={items[currentTabIndex].key}
          onChange={changeTab}
        ></Tabs>
      </Modal>
    </div>
  )
}
export default React.memo(Login)

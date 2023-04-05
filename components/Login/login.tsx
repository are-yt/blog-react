import React from 'react'
import { Form, Button, Input } from 'antd'
import { LOGIN, LoginValue } from '../../request/apis/user'
import messgaeStore from '../../store/messgae.Store'
import userStore from '../../store/user.Store'
interface Props {
  type: 'password'
  close: () => void
}
function LoginPanel(props: Props) {
  const rules = {
    email: [{ required: true, message: '此项为必须' }],
    password: [
      { required: true, message: '此项为必须' },
      { min: 5, max: 20, message: '密码长度为>5 and < 21' }
    ]
  }
  const toLogin = (values: LoginValue) => {
    // ...
    const { email, password } = values
    LOGIN({ type: props.type, email, password }).then(res => {
      if (!res.success) {
        return
      }
      // 登录成功
      userStore.changeUserInfo(res)
      // 关闭登录状态
      props.close()
      // 提示
      messgaeStore.call({ message: '登录成功', type: 'success' })
    })
  }
  return (
    <div className="login-panel">
      <Form
        labelAlign="left"
        validateTrigger="onBlur"
        autoComplete="off"
        labelCol={{ span: 3 }}
        onFinish={toLogin}
      >
        <br />
        <Form.Item label="邮箱" name="email" rules={rules.email}>
          <Input placeholder="注册时的邮箱" />
        </Form.Item>
        <br />
        <Form.Item label="密码" name="password" rules={rules.password}>
          <Input type="password" placeholder="注册时的密码" allowClear />
        </Form.Item>
        <br />
        <Form.Item>
          <Button type="primary" block htmlType="submit">
            登 录 (未注册账号会自动注册)
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
export default React.memo(LoginPanel)

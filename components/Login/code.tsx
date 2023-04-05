import React, { useRef, useCallback, useState } from 'react'
import { Form, Button, Input, Row, Col } from 'antd'
import { SENDCODE, LOGIN } from '../../request/apis/user'
import messageStore from '../../store/messgae.Store'
import userStore from '../../store/user.Store'
interface Props {
  type: 'code'
  close: () => void
}
interface LoginValue {
  code: string
  email: string
}
function CodePanel(props: Props) {
  const [codeBtnText, setCodeBtnText] = useState<string | number>('发送')
  const codeBtnTextRef = useRef(60)
  // 使用useRef避免验证码发送后到登录过程中此组件出现重新render，当前代码不会发生，但在后续修改可能成为一个潜在的bug
  const code = useRef('')
  const [form] = Form.useForm()
  // 倒计时
  const countDown = useCallback(() => {
    setCodeBtnText(60)
    codeBtnTextRef.current = 60
    const timer: number = setInterval(() => {
      // 异步回调中拿不到最新的codeBtnText，拿到的都是在异步执行那一刻的state值，这是react刻意为之
      // 因此这里要使用一个ref来同步保存
      // if ((codeBtnText as number) - 1 === 50) {
      //   clearInterval(timer as number)
      // }
      if (codeBtnTextRef.current === 0) {
        setCodeBtnText('发送')
        clearInterval(timer)
        return
      }
      setCodeBtnText(preState => {
        const newState = (preState as number) - 1
        codeBtnTextRef.current = newState
        return newState
      })
    }, 1000)
  }, [])
  // 发送验证码
  const sendCode = () => {
    const email = form.getFieldValue('email')
    if (!email.trim()) {
      return messageStore.call({ type: 'error', message: '请先输入邮箱' })
    }
    // 创建随机6位验证码
    code.current = ''
    for (let i = 0; i < 6; i++) {
      code.current += Math.floor(Math.random() * 10)
    }
    // 发送
    SENDCODE(email, code.current).then(res => {
      if (res.data === '发送失败') {
        return messageStore.call({
          type: 'error',
          message: '验证码发送失败，请检查邮箱的输入是否正确'
        })
      }
      messageStore.call({ type: 'success', message: '验证码已发送' })
      countDown()
    })
  }
  const toLogin = (loginValue: LoginValue) => {
    const { code: inputCode, email } = loginValue
    if (inputCode !== code.current) {
      return messageStore.call({ type: 'error', message: '验证码输入错误' })
    }
    LOGIN({
      password: inputCode,
      email,
      type: 'code'
    }).then(res => {
      if (res.code !== 200) {
        return
      }
      messageStore.call({ type: 'success', message: '登录成功' })
      userStore.changeUserInfo(res)
      props.close()
    })
  }
  const rules = {
    email: [{ required: true, message: '此项为必须' }],
    code: [
      { required: true, message: '此项为必须' },
      { min: 6, max: 6, message: '长度为6的验证码' }
    ]
  }
  return (
    <div className="code-panel">
      <Form
        form={form}
        labelAlign="left"
        validateTrigger="onBlur"
        autoComplete="off"
        labelCol={{ span: 4 }}
        onFinish={toLogin}
      >
        <br />
        <Form.Item label="邮箱" name="email" rules={rules.email}>
          <Input placeholder="注册时的邮箱" />
        </Form.Item>
        <br />
        <Form.Item label="验证码" name="code" rules={rules.code}>
          <Row gutter={20}>
            <Col span={19}>
              <Input placeholder="收到的验证码" />
            </Col>
            <Col>
              <Button
                onClick={sendCode}
                disabled={typeof codeBtnText === 'number' ? true : false}
              >
                {codeBtnText}
              </Button>
            </Col>
          </Row>
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
export default React.memo(CodePanel)

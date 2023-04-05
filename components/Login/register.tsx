import React, { useMemo, useCallback, useRef, useState } from 'react'
import { Form, Input, Button, Row, Col } from 'antd'
import messgaeStore from '../../store/messgae.Store'
import { SENDCODE } from '../../request/apis/user'
interface Props {
  changeLogin: () => void
}
interface RegisterValue {
  email: string
  code: string
  password: string
}
function RegisterPanel(props: Props) {
  const codeRef = useRef('')
  const [codeBtnText, setCodeBtnText] = useState<string | number>('发送')
  const codeBtnTextRef = useRef(0)
  const [form] = Form.useForm()
  const rules = useMemo(() => {
    return {
      email: [{ required: true, message: '此项为必须' }],
      code: [
        { required: true, message: '此项为必须' },
        { min: 6, max: 6, message: '输入6位长度的验证码' }
      ],
      password: [
        { required: true, message: '此项为必须' },
        { min: 6, max: 16, message: '密码长度>=6 并且 <= 16' }
      ],
      confirmRules: [
        { required: true, message: '请确认密码' },
        (form: any) => ({
          validator(_: any, value: string) {
            if (!value || form.getFieldValue('password') === value) {
              return Promise.resolve()
            }
            return Promise.reject(new Error('两次密码的输入不一致'))
          }
        })
      ]
    }
  }, [])
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
  const sendCode = useCallback(() => {
    const email = form.getFieldValue('email')
    if (!email) {
      return messgaeStore.call({ type: 'error', message: '请先输入邮箱' })
    }
    codeRef.current = ''
    for (let i = 0; i < 6; i++) {
      codeRef.current += Math.floor(Math.random() * 10)
    }
    SENDCODE(email, codeRef.current).then(res => {
      if (res.data === '发送失败') {
        return messgaeStore.call({ type: 'error', message: '验证码发送失败' })
      }
      messgaeStore.call({ type: 'success', message: '验证码已发送' })
      countDown()
    })
  }, [])
  const toRegister = useCallback((values: RegisterValue) => {
    const { password, code, email } = values
    if (code !== codeRef.current) {
      return messgaeStore.call({ type: 'error', message: '验证码错误' })
    }
  }, [])
  return (
    <div className="register-panel">
      <br />
      <Form
        form={form}
        labelAlign="left"
        labelCol={{ span: 4 }}
        validateTrigger="onBlur"
        onFinish={toRegister}
      >
        <Form.Item label="邮箱" name="email" rules={rules.email}>
          <Input placeholder="注册的邮箱账号" />
        </Form.Item>
        <br />
        <Form.Item label="验证码" name="code" rules={rules.code}>
          <Row gutter={20}>
            <Col span={19}>
              <Input placeholder="验证码" />
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
        <Form.Item label="密码" name="password" rules={rules.password}>
          <Input type="password" placeholder="注册的密码" />
        </Form.Item>
        <br />
        <Form.Item
          label="确认密码"
          name="confirmPassword"
          dependencies={['password']}
          rules={rules.confirmRules}
        >
          <Input type="password" placeholder="确认密码" />
        </Form.Item>
        <br />
        <Form.Item>
          <Button type="primary" block htmlType="submit">
            确认
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
export default React.memo(RegisterPanel)

import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Form, Button, Input, Row, Col } from 'antd'
import { SENDCODE, RESETPASSWORD } from '../../request/apis/user'
import userStore from '../../store/user.Store'
import messgaeStore from '../../store/messgae.Store'
interface LoginValue {
  code: string
  email: string
  newPassword: string
}
interface Props {
  changeLogin: () => void
}
function ForgetPanel(props: Props) {
  const [codeBtnText, setCodeBtnText] = useState<string | number>('发送')
  const codeBtnTextRef = useRef(60)
  const code = useRef('')
  const [form] = Form.useForm()
  const rules = useMemo(
    () => ({
      email: [{ required: true, message: '此项为必须' }],
      code: [
        { required: true, message: '此项为必须' },
        { min: 6, max: 6, message: '验证码为6位长度的数字' }
      ],
      newPassword: [
        { required: true, message: '此项为必须' },
        { min: 6, max: 16, message: '密码长度需要>=6位并<=16位' }
      ]
    }),
    []
  )
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
    code.current = ''
    const email = form.getFieldValue('email')
    if (!email) {
      return messgaeStore.call({ type: 'error', message: '请先输入邮箱' })
    }
    for (let i = 0; i < 6; i++) {
      code.current += Math.floor(Math.random() * 10)
    }
    SENDCODE(email, code.current).then(res => {
      if (res.data === '发送失败') {
        return messgaeStore.call({ type: 'error', message: '验证码发送失败' })
      }
      messgaeStore.call({ type: 'success', message: '验证码已发送' })
      countDown()
    })
  }, [])
  // 重置密码
  const toReset = useCallback((values: LoginValue) => {
    const { code: inputCode, email, newPassword } = values
    if (inputCode !== code.current) {
      return messgaeStore.call({ type: 'error', message: '验证码错误' })
    }
    RESETPASSWORD({
      newPassword,
      email
    }).then(res => {
      if (res.success) {
        messgaeStore.call({ type: 'success', message: '重置密码成功,请去登录' })
        form.setFieldsValue({ email: '', code: '', newPassword: '' })
        props.changeLogin()
        userStore.changeUserInfo(res)
      }
    })
  }, [])
  return (
    <div className="forget-panel">
      <Form
        form={form}
        labelAlign="left"
        validateTrigger="onBlur"
        autoComplete="off"
        labelCol={{ span: 4 }}
        onFinish={toReset}
      >
        <br />
        <Form.Item label="邮箱" name="email" rules={rules.email}>
          <Input placeholder="注册时的邮箱" />
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
        <Form.Item label="新密码" name="newPassword" rules={rules.newPassword}>
          <Input type="password" placeholder="请输入新密码" />
        </Form.Item>
        <br />
        <Form.Item>
          <Button type="primary" block htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
// 在不接收外部props并没有自身state的情况下，该组件不会执行第二次render，因此组件中不需要使用useMemo、useCallback等做优化，
// 减少了无用的优化可以降低代码的体积。

// 在这个组件中虽然没有外部的props，但有自身的state，会触发再次render，因此需要进行一些useMemo,useCallback的优化
export default React.memo(ForgetPanel)

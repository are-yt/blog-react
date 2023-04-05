import http from '../index'
// 登录
export interface LoginValue {
  email: string
  password: string
  type: 'password' | 'code'
}
export const LOGIN = (loginValue: LoginValue) => {
  return http.request({
    url: '/user/login',
    method: 'POST',
    data: loginValue
  })
}
// 发送登录验证码
export const SENDCODE = (email: string, code: string) => {
  return http.request({
    url: '/code/send',
    method: 'POST',
    data: {
      email,
      code
    }
  })
}
// 查询是否订阅
export const QUERYISSUBSCRIBE = (id: number) => {
  return http.request({
    url: `/subscribe/query/${id}`,
    method: 'GET'
  })
}
// 重置密码
interface ResetPassword {
  email: string
  newPassword: string
}
export const RESETPASSWORD = (data: ResetPassword) => {
  return http.request({
    url: '/user/forget',
    method: 'POST',
    data
  })
}
// 订阅与取消订阅
export const SUBSCRIBE = (flag: boolean) => {
  return http.request({
    url: `/subscribe/handle/${flag}`,
    method: 'POST'
  })
}
// 更新头像
export const UPLOADAVATAR = (img: FormData) => {
  return http.request({
    url: '/user/update/avatar',
    method: 'POST',
    data: img,
    isLoading: true
  })
}
// 修改昵称
export const UPDATENICKNAME = (name: string) => {
  return http.request({
    url: `/user/update/name/${name}`,
    method: 'POST'
  })
}

import http from '../index'
// 获取访客留言
export const GETTALKLIST = () => {
  return http.request({
    url: '/leaveword/list'
  })
}
// 发送留言
export const SENDTALK = (content: string) => {
  return http.request({
    url: '/leaveword/send',
    method: 'POST',
    data: {
      content
    }
  })
}

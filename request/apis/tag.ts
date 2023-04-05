import http from '../index'
// 获取标签列表
export const GETTAGLIST = () => {
  return http.request({
    url: '/tag/list'
  })
}

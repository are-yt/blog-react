import http from '../index'
// 获取分类
export const GETCATELIST = () => {
  return http.request({
    url: '/cate/list',
    method: 'GET'
  })
}

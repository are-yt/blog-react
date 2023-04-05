import http from '../../index'

// 获取诗词
export const GETSHICI = (token: string | null) => {
  return http.request({
    url: '/shici',
    method: 'GET',
    params: {
      token
    }
  })
}

// 获取首页文章列表
export const GETHOMEARTICLELIST = () => {
  return http.request({
    url: '/articles/hot/list',
    method: 'GET'
  })
}

// 获取标签、分类、文章数量信息
export const GETCOUNTERINFO = () => {
  return http.request({
    url: '/info/data',
    method: 'GET'
  })
}

// 获取统计信息
export const GETSTATISTICS = () => {
  return http.request({
    url: '/info/statistics',
    method: 'GET'
  })
}

// 用户访问控制
export const GETUSERVIEW = () => {
  return http.request({
    url: '/info/is/view',
    method: 'GET'
  })
}

// 查询订阅数量
export const QUERYSUBSCRIBECOUNT = () => {
  return http.request({
    url: '/subscribe/total',
    method: 'GET'
  })
}

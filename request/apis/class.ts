import http from '../index'
// 获取归档分页数据
export const GETCLASSLIST = (offset: number, size: number) => {
  return http.request({
    url: `/class/list/${offset}/${size}`,
    method: 'GET'
  })
}

import http from '../index'
// 搜索文章
export const SEARCHARTICLE = (keyword: string) => {
  return http.request({
    url: `/articles/search/${keyword}`,
    method: 'GET'
  })
}
// 根据分类/标签筛选文章
interface FiltrateArticle {
  type: 0 | 1
  id: number
  offset: number
  size: number
}
export const FILTRATEARTICLE = (params: FiltrateArticle) => {
  const { type, id, offset, size } = params
  return http.request({
    url: `/articles/filtrate/${type}/${id}/${offset}/${size}`,
    method: 'GET'
  })
}
// 获取文章详情
export const GETARTICLEDETAIL = (id: number) => {
  return http.request({
    url: `/articles/detail/${id}`,
    method: 'GET'
  })
}
// 获取文章评论数据
interface CommentProps {
  offset: number
  size: number
  articleId: number
}
export const GETARTICLECOMMENT = (params: CommentProps) => {
  const { offset, size, articleId } = params
  return http.request({
    url: `/articles/comment/list/${offset}/${size}/${articleId}`,
    method: 'GET'
  })
}
// 发布文章评论
interface SendComment {
  parentId?: number
  replyId?: number
  content: string
  articleId: number
}
export const SENDCOMMENT = (params: SendComment) => {
  const { parentId, replyId, content, articleId } = params
  return http.request({
    url: `/articles/comment/send/${articleId}`,
    method: 'POST',
    data: {
      parentId: parentId ?? null,
      replyId: replyId ?? null,
      content
    },
    isLoading: true
  })
}
// 文章评论点赞
export const ENDORSECOMMENT = (commentId: number) => {
  return http.request({
    url: `/articles/comment/endorse/${commentId}`,
    method: 'POST'
  })
}
// 增加文章点击量
export const INCREMENTARTICLECLICKCOUNT = (commentId: number) => {
  return http.request({
    url: `/articles/click/${commentId}`,
    method: 'GET'
  })
}

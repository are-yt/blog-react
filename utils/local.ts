// 保存诗词token
export const SAVESHICITOKEN = (token: string) => {
  localStorage.setItem('shici-token', token)
}
// 获取诗词token
export const GETSHICITOKEN = (): string | null => {
  return localStorage.getItem('shici-token')
}
// 保存主题
export const SAVETHEME = (theme: 'dark' | 'light') => {
  localStorage.setItem('theme', theme)
}
// 获取主题
export const GETTHEME = () => {
  return localStorage.getItem('theme')
}
// 保存用户登录信息
export const SAVEUSERINFO = (userInfo: any) => {
  localStorage.setItem('userinfo', JSON.stringify(userInfo))
}
// 获取用户登录信息
export const GETUSERINFO = () => {
  return localStorage.getItem('userinfo')
}

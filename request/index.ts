import axios from 'axios'
import type { HttpInstanceConfig, RequestConfig } from './types'
import type { AxiosInstance } from 'axios'
import spinStore from '../store/showSpin.Store'
import NProgress from '../utils/nprogress'
import messgaeStore from '../store/messgae.Store'
import { GETUSERINFO } from '../utils/local'
class Http {
  http: AxiosInstance | null = null
  constructor(config?: HttpInstanceConfig) {
    this.http = axios.create({
      timeout: config?.timeout || 8000,
      baseURL: config?.baseURL || '',
      withCredentials: config?.withCredentials || true
    })
    const interceptors = config?.interceptors
    // 固定的请求拦截器
    this.http.interceptors.request.use(config => {
      const userInfo = GETUSERINFO()
      if (userInfo) {
        config.headers.Authorization = JSON.parse(userInfo).token
      }
      return config
    })
    this.http.interceptors.request.use(
      interceptors?.requestSucInterceptor,
      interceptors?.requestFailInterceptor
    )
    this.http.interceptors.response.use(
      interceptors?.responseSucInterceptor,
      interceptors?.responseFaillInterceptor
    )
  }
  request(config: RequestConfig): Promise<any> {
    if (config.isLoading) {
      // 请求开始的时候开启spin并开启NProgress
      NProgress.start()
      spinStore.changeShowState(true)
    }
    return new Promise((resolve, reject) => {
      this.http
        ?.request(config)
        .then((res: any) => {
          // 请求完毕关闭spin
          spinStore.changeShowState(false)
          const data = res.data
          // 对非正常的响应码进行处理
          if (!data.success) {
            console.log(data)
            messgaeStore.call({
              type: 'error',
              message: '请求出错:' + data.errMsg
            })
          }
          NProgress.done()
          resolve(data)
        })
        .catch(err => {
          const data = err.response
          // 对错误的状态码进行处理
          if (data && data.status === 401) {
            messgaeStore.call({
              type: 'error',
              message: '登录过期，请重新登录'
            })
          } else {
            messgaeStore.call({
              type: 'error',
              message: `响应错误: ${err.message}`
            })
          }
          // 响应错误
          // 请求完毕关闭spin和NProgress
          spinStore.changeShowState(false)
          NProgress.done()
          reject(err)
        })
    })
  }
}
const http = new Http({
  baseURL: ''
})
export default http

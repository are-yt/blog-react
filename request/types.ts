import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig
} from 'axios'
interface InstanceInterceptors {
  requestSucInterceptor?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig
  requestFailInterceptor?: (err: any) => any
  responseSucInterceptor?: (response: AxiosResponse) => AxiosResponse
  responseFaillInterceptor?: (err: any) => any
}
export interface HttpInstanceConfig {
  timeout?: number
  baseURL?: string
  withCredentials?: boolean
  interceptors?: InstanceInterceptors
}
export interface RequestConfig extends AxiosRequestConfig {
  isLoading?: boolean
}

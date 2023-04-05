import { makeAutoObservable } from 'mobx'
type Type = 'error' | 'info' | 'loading' | 'success' | 'warning'
interface Config {
  message: string
  type: Type
}
class MessageStore {
  message = ''
  callCount = 0
  type: Type = 'info'
  constructor() {
    makeAutoObservable(this)
  }
  call(config: Config) {
    // 用于更新触发MessageApi组件函数重新执行，从而开启提示
    const { message, type } = config
    if (message) {
      this.message = message
    }
    if (type) {
      this.type = type
    }
    this.callCount++
  }
}
export default new MessageStore()

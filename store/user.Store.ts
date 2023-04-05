import { makeAutoObservable, runInAction } from 'mobx'
import { SAVEUSERINFO, GETUSERINFO } from '../utils/local'
import { QUERYISSUBSCRIBE } from '../request/apis/user'
class UserStore {
  userInfo: any = null
  isSubscribe = false
  constructor() {
    makeAutoObservable(this)
    const userInfo = GETUSERINFO()
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo)
      this.querySubscribe()
    }
  }
  changeUserInfo = (userInfo: any) => {
    this.userInfo = userInfo
    SAVEUSERINFO(userInfo)
    // 登录成功后获取订阅信息
    this.querySubscribe()
  }
  querySubscribe() {
    QUERYISSUBSCRIBE(this.userInfo.id).then(res => {
      runInAction(() => {
        this.isSubscribe = res.subscribe
      })
    })
  }
  logout() {
    // 退出登录
    this.userInfo = null
    this.isSubscribe = false
  }
  changeSubscribe(flag: boolean) {
    this.isSubscribe = flag
  }
}
export default new UserStore()

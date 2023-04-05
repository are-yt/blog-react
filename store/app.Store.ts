import { makeAutoObservable } from 'mobx'
class AppStore {
  isLogin = false
  isShowFooter = true
  constructor() {
    makeAutoObservable(this)
  }
  changeLoginState(isLogin: boolean) {
    this.isLogin = isLogin
  }
  changeShowFooterState(isShow: boolean) {
    this.isShowFooter = isShow
  }
}
export default new AppStore()

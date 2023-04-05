import { makeAutoObservable } from 'mobx'
class ShowSpinStore {
  showSpin = false
  constructor() {
    makeAutoObservable(this)
  }
  changeShowState(state: boolean) {
    this.showSpin = state
  }
}
export default new ShowSpinStore()

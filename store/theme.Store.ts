import { makeAutoObservable } from 'mobx'
import { theme } from 'antd'
import { fromJS } from 'immutable'
import { SAVETHEME, GETTHEME } from '../utils/local'
class ThemeStore {
  // 当前主题
  currentTheme: 'light' | 'dark' = 'light'
  // 自定义antd的主题样式
  themeConfig = fromJS({
    token: { colorPrimary: '#90d7ec' },
    algorithm:
      this.currentTheme === 'light'
        ? theme.defaultAlgorithm
        : theme.darkAlgorithm,
    components: {}
  })
  // 当前主题下的背景颜色
  constructor() {
    makeAutoObservable(this)
    const _theme = GETTHEME()
    if (_theme === 'dark' || _theme === 'light') {
      this.currentTheme = _theme
    }
    if (_theme === 'light') {
      this.themeConfig = this.themeConfig.update(
        'algorithm',
        (() => theme.defaultAlgorithm) as any
      )
    } else {
      this.themeConfig = this.themeConfig = this.themeConfig.update(
        'algorithm',
        (() => theme.darkAlgorithm) as any
      )
    }
  }
  get currentBgColor() {
    return this.currentTheme === 'light' ? '#f7f7f7' : '#242424'
  }
  changeTheme() {
    let newTheme: 'dark' | 'light'
    if (this.currentTheme === 'light') {
      newTheme = 'dark'
    } else {
      newTheme = 'light'
    }
    // 保存主题
    SAVETHEME(newTheme)
    this.currentTheme = newTheme
    if (newTheme === 'light') {
      this.themeConfig = this.themeConfig.update(
        'algorithm',
        (() => theme.defaultAlgorithm) as any
      )
      return true
    }
    this.themeConfig = this.themeConfig = this.themeConfig.update(
      'algorithm',
      (() => theme.darkAlgorithm) as any
    )
  }
}
export default new ThemeStore()

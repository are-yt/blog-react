import React from 'react'
import { observer } from 'mobx-react-lite'
import themeStore from '../../store/theme.Store'
import './index.scss'
function Footer() {
  const isDark = themeStore.currentTheme === 'dark'
  return (
    <div id="footer" style={{ background: isDark ? '#cccccc20' : '#90d7ec' }}>
      <p>未备案</p>
      <div>联系: 2821458718@qq.com</div>
    </div>
  )
}
export default React.memo(observer(Footer))

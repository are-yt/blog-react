import React, { useState, useRef, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Space } from 'antd'
import classnames from 'classnames'
import themeStore from '../../store/theme.Store'
import './index.scss'
function ToolAside() {
  const timer = useRef<number | null>(null)
  const [showSetting, setShowSetting] = useState(false)
  const [showControl, setShowControl] = useState(false)
  useEffect(() => {
    document.addEventListener('scroll', () => {
      // 节流操作
      if (timer.current) {
        return
      }
      if (window.scrollY > 50) {
        setShowSetting(true)
      } else {
        setShowSetting(false)
        setShowControl(false)
      }
      timer.current = setTimeout(() => {
        clearTimeout(timer.current as number)
        timer.current = null
      }, 50)
    })
  }, [])
  const changeShowState = useCallback(() => {
    setShowControl(preState => {
      return !preState
    })
  }, [])
  // 返回顶部
  const backTop = useCallback(() => {
    // const scrollTop = window.scrollY
    let timer: number | null = setInterval(() => {
      const _scrollTop = window.scrollY
      const speed = _scrollTop / 6
      if (document.body.scrollTop) {
        if (_scrollTop - speed <= 0) {
          document.body.scrollTop = 0
          clearInterval(timer as number)
          timer = null
        } else {
          document.body.scrollTop = _scrollTop - speed
        }
      } else {
        if (_scrollTop - speed <= 0) {
          document.documentElement.scrollTop = 0
          clearInterval(timer as number)
          timer = null
        } else {
          document.documentElement.scrollTop = _scrollTop - speed
        }
      }
    }, 10)
  }, [])
  // 切换主题暗黑/明亮模式
  const toggleTheme = () => {
    themeStore.changeTheme()
  }
  const rowSettingClass = classnames('row', 'row-setting', {
    'row-hidden': !showSetting,
    'row-show': showSetting
  })
  const row1ControlClass = classnames('row', 'row1', {
    'row1-hidden': !showControl
  })
  const row2ControlClass = classnames('row', 'row2', {
    'row2-hidden': !showControl
  })
  const isDark = themeStore.currentTheme === 'dark'
  return (
    <div id="tool-aside">
      <Space wrap>
        <div
          style={{ color: isDark ? '#fff' : '' }}
          className={row1ControlClass}
          onClick={toggleTheme}
        >
          <i className="iconfont icon-wb_sunny"></i>
        </div>
        <div
          style={{ color: isDark ? '#fff' : '' }}
          className={row2ControlClass}
          onClick={backTop}
        >
          <i className="iconfont icon-top"></i>
        </div>
        <div className={rowSettingClass} onClick={changeShowState}>
          <i className="iconfont icon-setting"></i>
        </div>
      </Space>
    </div>
  )
}
export default React.memo(observer(ToolAside))

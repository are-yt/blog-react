import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  GETCOUNTERINFO,
  GETSTATISTICS,
  GETUSERVIEW,
  QUERYSUBSCRIBECOUNT
} from '../../../../request/apis/home'
import { SUBSCRIBE } from '../../../../request/apis/user'
import { observer } from 'mobx-react-lite'
import themeStore from '../../../../store/theme.Store'
import classnames from 'classnames'
import { Button } from 'antd'
import userStore from '../../../../store/user.Store'
import messgaeStore from '../../../../store/messgae.Store'
import './index.scss'
function BasicInfo() {
  const isSubscribe = userStore.isSubscribe
  const timerRef = useRef<number | null>(null)
  const [subscribeCount, setSubscribeCount] = useState(0)
  const [counter, setCounter] = useState<any>({
    articleCount: 0,
    tagCount: 0,
    cateCount: 0
  })
  const [statistics, setStatistics] = useState<any>({
    runingTime: '无',
    viewCount: 0,
    lastUpdate: '无'
  })
  // 获取数据
  useEffect(() => {
    // 获取文章、标签、分类数量
    GETCOUNTERINFO().then(res => {
      if (res.code === 200) {
        setCounter(res.data)
      }
    })
    // 获取统计信息
    GETSTATISTICS().then(res => {
      if (res.code === 200) {
        const { last_update, run_hours, views } = res.data
        setStatistics(() => {
          const runingTime = `${Math.floor(run_hours / 24)}天-${
            run_hours % 24
          }小时`
          const lastUpdate = last_update.split(' ')[0]
          const viewCount = `${views}次`
          return {
            runingTime,
            lastUpdate,
            viewCount
          }
        })
      }
    })
    // 用户访问控制，正常来说应该写在App里，因为如果没有从首页进入博客，这个方法不会被触发
    // 但还有种逻辑就是访问站点首页才算是真正的访问了该博客，后续维护看到不必认为这是一个错误逻辑
    GETUSERVIEW()
    // 获取订阅数量
    QUERYSUBSCRIBECOUNT().then(res => {
      if (res.code === 200) {
        setSubscribeCount(res.total)
      }
    })
  }, [])
  // 订阅
  const subscribe = useCallback(() => {
    if (!userStore.userInfo) {
      return messgaeStore.call({ type: 'error', message: '请先登录' })
    }
    // ...
    if (!timerRef.current) {
      // 此操作节流处理
      // 发起请求进行订阅/取消订阅
      const thisSubscribeResult = !userStore.isSubscribe
      SUBSCRIBE(thisSubscribeResult).then(res => {
        if (res.success) {
          if (thisSubscribeResult) {
            messgaeStore.call({ type: 'success', message: '订阅成功' })
            setSubscribeCount(preState => preState + 1)
          } else {
            messgaeStore.call({ type: 'success', message: '取消订阅' })
            setSubscribeCount(preState => preState - 1)
          }
          userStore.changeSubscribe(thisSubscribeResult)
        }
      })
      timerRef.current = setTimeout(() => {
        clearTimeout(timerRef.current as number)
        timerRef.current = null
      }, 10 * 1000)
      return
    }
    // 在时间间隔内再次触发，取消并提示用户本次操作
    messgaeStore.call({ type: 'info', message: '操作过快，请间隔10s再试' })
  }, [])
  // 暗黑模式下的样式类
  const classes = classnames('basic-info', {
    'basic-info-dark': themeStore.currentTheme === 'dark'
  })
  return (
    <div className={classes}>
      <div className="inner">
        {/* 档案信息 */}
        <div className="profile">
          <img src="http:///p2.qhimg.com/t0120c23de0d098ff4d.jpg" alt="" />
          <br />
          <p className="intro">舟遥遥以轻飏，风飘飘而吹衣。</p>
          <div className="counter">
            <div className="item">
              <p>标签</p>
              <div>{counter.tagCount}</div>
            </div>
            <div className="item">
              <p>分类</p>
              <div>{counter.cateCount}</div>
            </div>
            <div className="item">
              <p>文章</p>
              <div>{counter.articleCount}</div>
            </div>
          </div>
          <br />
          <div className="subscribe">
            <Button
              size="small"
              type="primary"
              shape="round"
              block
              onClick={subscribe}
            >
              {isSubscribe ? '已订阅' : '订阅'} &nbsp;({subscribeCount})
            </Button>
          </div>
        </div>
        {/* 公告 */}
        <div className="notice">
          <div className="icon">
            <i className="iconfont icon-notice"></i>
          </div>
          <div className="content">
            <div className="title">公告</div>
            <br />
            <p>还没有公告...</p>
          </div>
        </div>
        {/* 统计信息 */}
        <div className="statistics">
          <i className="iconfont icon-icons_statistics"></i>
          <div className="content">
            <div>网站运行信息</div>
            <br />
            <p>已运行时间: {statistics.runingTime}</p>
            <p>总访问次数: {statistics.viewCount}</p>
            <p>最后更新时间: {statistics.lastUpdate}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default React.memo(observer(BasicInfo))

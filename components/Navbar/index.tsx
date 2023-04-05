import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import appStore from '../../store/app.Store'
import userStore from '../../store/user.Store'
import messgaeStore from '../../store/messgae.Store'
import classnames from 'classnames'
import { Modal, Button, Row, Col, Input, Divider } from 'antd'
import { SEARCHARTICLE } from '../../request/apis/articles'
import SearchResult from './SearchResult'
import './index.scss'
function Navbar() {
  const navigate = useNavigate()
  const scrollDistance = useRef(0)
  const [showType, setShowType] = useState<0 | 1 | 2>(0)
  const [isLogout, setIsLogout] = useState(false)
  const timer = useRef<number | null>(null)
  const pathname = useLocation().pathname
  // 搜索防抖计时器
  const debounceSearchTimer = useRef<number | null>()
  // 搜素对话框开启状态
  const [openSearch, setOpenSearch] = useState(false)
  // 搜索结果
  const [searchResult, setSearchResult] = useState([])
  // 是否正在搜索，展示loading
  const [isSearch, setIsSearch] = useState(false)
  // 滚动节流操作，滚动时每100ms只计算一次滚动行为
  const debounceScroll = useCallback(() => {
    if (!timer.current) {
      const scrollTop = document.documentElement.scrollTop
      if (scrollTop === 0) {
        // 本次滚动到了0的位置
        setShowType(0)
      } else if (scrollDistance.current > scrollTop) {
        // 本次滚动为向上滚动
        setShowType(1)
      } else if (scrollDistance.current < scrollTop) {
        // 本次滚动为向下滚动
        setShowType(2)
      }
      scrollDistance.current = scrollTop
    }
    timer.current = setTimeout(() => {
      timer.current = null
    }, 100)
  }, [])
  // 初始渲染侦听页面滚动
  useEffect(() => {
    document.addEventListener('scroll', () => {
      debounceScroll()
    })
  }, [])
  const classList = useMemo(() => {
    return classnames('navbar', {
      navTop: showType === 1,
      navBottom: showType === 2
    })
  }, [showType])
  const computedActiveItem = useCallback(
    (names: string[]) => {
      const path = pathname.replace(/\//g, ',').split(',')[1]
      return names.includes(path)
    },
    [pathname]
  )
  const openLogin = useCallback(() => {
    appStore.changeLoginState(true)
  }, [])
  // 退出登录
  const logout = useCallback((e: any) => {
    e.stopPropagation()
    setIsLogout(true)
  }, [])
  // 打开搜索框
  const handleOpenSearch = useCallback(() => {
    setOpenSearch(true)
  }, [])
  // 关闭搜索
  const closeSearch = useCallback(() => {
    setOpenSearch(false)
  }, [])
  // 确认与取消退出登录
  const handleModalControl = useCallback((flag: boolean) => {
    if (flag) {
      navigate('/home')
      userStore.logout()
      messgaeStore.call({ type: 'success', message: '已退出登录' })
    }
    setIsLogout(false)
  }, [])
  // 前往归档
  const toClass = useCallback(() => {
    navigate('/class')
  }, [])
  // 前往分类
  const toCate = useCallback(() => {
    navigate('/cate')
  }, [])
  // 前往标签
  const toTag = useCallback(() => {
    navigate('/tag')
  }, [])
  // 前往留言
  const toGuestTalk = useCallback(() => {
    navigate('/guest-talk')
  }, [])
  // 前往个人信息
  const toProfile = useCallback(() => {
    navigate('/profile')
  }, [])
  // 回到首页
  const toHome = useCallback(() => {
    navigate('/home')
  }, [])
  // 搜索文章
  const handleSearch = useCallback((value: string) => {
    if (!value.trim()) {
      return messgaeStore.call({ type: 'error', message: '请输入关键字' })
    }
    if (debounceSearchTimer.current) {
      return messgaeStore.call({ type: 'error', message: '操作过快~' })
    }
    debounceSearchTimer.current = setTimeout(() => {
      clearTimeout(debounceSearchTimer.current as number)
      debounceSearchTimer.current = null
    }, 5 * 1000)
    setIsSearch(true)
    SEARCHARTICLE(value).then(res => {
      setIsSearch(false)
      if (res.success) {
        messgaeStore.call({ type: 'success', message: '查询成功' })
        setSearchResult(res.list)
      }
    })
  }, [])
  return (
    <div className={classList}>
      <h3 onClick={toHome}>Cy的博客</h3>
      <div className="nav-list">
        <div className="item" onClick={handleOpenSearch}>
          <div className="border"></div>
          <i className="iconfont icon-search"></i>
          <span>搜索</span>
        </div>
        <div
          className="item"
          style={{ color: computedActiveItem(['home']) ? '#90d7ec' : '' }}
          onClick={toHome}
        >
          <div className="border"></div>
          <i className="iconfont icon-home"></i>
          <span>首页</span>
        </div>
        <div
          className="item"
          style={{
            color: computedActiveItem(['class', 'cate', 'tag']) ? '#90d7ec' : ''
          }}
        >
          <div className="border"></div>
          <i className="iconfont icon-find"></i>
          <span>发现</span>
          <i className="icon-select iconfont icon-xiala-xia"></i>
          <div className="children">
            <div className="child" onClick={toClass}>
              <i className="iconfont icon-guidang"></i>
              <span>归档</span>
            </div>
            <div className="child" onClick={toCate}>
              <i className="iconfont icon-fenlei"></i>
              <span>分类</span>
            </div>
            <div className="child" onClick={toTag}>
              <i className="iconfont icon-biaoqian"></i>
              <span>标签</span>
            </div>
          </div>
        </div>
        <div
          className="item"
          style={{ color: computedActiveItem(['message']) ? '#90d7ec' : '' }}
          onClick={toGuestTalk}
        >
          <div className="border"></div>
          <i className="iconfont icon-liuyan"></i>
          <span>留言</span>
        </div>
        <div
          style={{ display: userStore.userInfo ? 'none' : 'block' }}
          className="item"
          onClick={openLogin}
        >
          <div className="border"></div>
          <i className="iconfont icon-denglu"></i>
          <span>登录</span>
        </div>
        <div
          className="item"
          style={{
            display: userStore.userInfo ? 'block' : 'none',
            color: computedActiveItem(['profile']) ? '#90d7ec' : ''
          }}
        >
          <div className="border"></div>
          <i className="iconfont icon-profile"></i>
          <span>我的</span>
          <i className="icon-select iconfont icon-xiala-xia"></i>
          <div className="children" onClick={toProfile}>
            <div className="child">
              <div className="iconfont icon-gerenxinxi"></div>
              <span>个人信息</span>
            </div>
            <div className="child" onClick={logout}>
              <i className="iconfont icon-logout"></i>
              <span>退出登录</span>
            </div>
          </div>
        </div>
      </div>
      {/**退出登录对话框 */}
      <Modal
        className="modal"
        title="提示"
        open={isLogout}
        footer={null}
        onCancel={() => handleModalControl(false)}
      >
        <p>确认退出登录吗?</p>
        <div className="control">
          <Row gutter={20}>
            <Col offset={5}>
              <Button type="primary" onClick={() => handleModalControl(true)}>
                确定
              </Button>
            </Col>
            <Col>
              <Button onClick={() => handleModalControl(false)}>取消</Button>
            </Col>
          </Row>
        </div>
      </Modal>
      {/**搜索对话框 */}
      <Modal
        title="搜索文章"
        className="search-modal"
        open={openSearch}
        footer={null}
        onCancel={closeSearch}
      >
        {/**搜索框内容 */}
        <br />
        <Input.Search
          placeholder="搜索本站文章"
          enterButton
          onSearch={handleSearch}
          loading={isSearch}
        />
        <Divider>搜索结果 - {searchResult.length}</Divider>
        <div className="list">
          {searchResult.map((item: any) => {
            return (
              <SearchResult
                key={item.id}
                url={item.surface}
                onClick={() => navigate(`/article/${item.id}`)}
              >
                <div className="surface"></div>
                <div className="info">
                  <h3>{item.title}</h3>
                  <div className="time">
                    <span>{item.createAt.split(' ')[0]}</span>
                    <span>点击量: {item.viewCount}</span>
                  </div>
                  <div className="content">{item.content}</div>
                </div>
              </SearchResult>
            )
          })}
        </div>
      </Modal>
    </div>
  )
}
export default React.memo(observer(Navbar))

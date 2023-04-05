import React, { useEffect, useState, useRef, useCallback } from 'react'
import PageSurface from '../../components/PageSurface'
import themeStore from '../../store/theme.Store'
import Comment from './Comment'
import { Tag, Space } from 'antd'
import { useParams } from 'react-router-dom'
import {
  GETARTICLEDETAIL,
  GETARTICLECOMMENT,
  INCREMENTARTICLECLICKCOUNT
} from '../../request/apis/articles'
import classnames from 'classnames'

import { Viewer } from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight-ssr'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import gemoji from '@bytemd/plugin-gemoji'
import breaks from '@bytemd/plugin-breaks'
// 引入基础css
import 'bytemd/dist/index.min.css'
// 引入高亮css
import 'highlight.js/styles/vs.css'

import CatelogItem from './styled'

import './index.scss'
import { observer } from 'mobx-react-lite'

const plugins = [gfm(), highlight(), mediumZoom(), gemoji(), breaks()]

// 此函数用于计算一个节点距离页面顶部的距离
const getDistanceOffsetTop = (el: any) => {
  let top = 0
  while (el) {
    top += el.offsetTop
    el = el.offsetParent
  }
  return top
}

// 评论每页大小
const commentPageSize = 6

function Article() {
  const isDark = themeStore.currentTheme === 'dark'
  const { id } = useParams() as { id: string }
  const [detail, setDetail] = useState<any>()
  // 标题信息列表
  const [catelog, setCatelog] = useState<any>()
  // viewer ref
  const [viewerRef, setViewerRef] = useState<any>()
  // 侦听滚动行为防抖计时器
  const debounceScrollTimer = useRef<number | null>()
  // 在点击目录跳转时，不进行滚动侦听
  const isListenerScroll = useRef(true)
  // 评论页码
  const [commentPage, setCommentPage] = useState(0)
  // 评论数据
  const [commentList, setCommentList] = useState<any>([])
  // 评论总数和一级评论数
  const [commentCount, setCommentCount] = useState({
    totalComment: 0,
    total: 0
  })
  // 获取文章详情数据
  useEffect(() => {
    GETARTICLEDETAIL(Number(id)).then(res => {
      if (res.success) {
        // 获取文章详情成功
        setDetail(res.data)
      }
    })
  }, [])
  // 增加文章点击量
  useEffect(() => {
    INCREMENTARTICLECLICKCOUNT(Number(id))
  }, [])
  // 获取文章评论数据
  useEffect(() => {
    GETARTICLECOMMENT({
      offset: commentPage,
      size: commentPageSize,
      articleId: Number(id)
    }).then(res => {
      if (res.success) {
        res.list.forEach((item: any) => (item.showCount = 4))
        setCommentList((prevState: any[]) => {
          const list = [...prevState].concat(res.list)
          return list
        })
        setCommentCount({
          totalComment: res.allCount,
          total: res.total
        })
      }
    })
  }, [commentPage])
  // 侦听viewer的挂载完成，然后根据内容创建目录
  useEffect(() => {
    if (viewerRef) {
      setTimeout(() => {
        // 隔两秒在计算目录，因为此时刚挂载如果文章里有图片，图片没立刻加载完成会造成高度压缩，获取到的标题位置不正确
        const childNodes = viewerRef.firstChild.childNodes
        // 获取并计算所有的标题元素位置
        const titles: any = []
        for (let i = 0; i < childNodes.length; i++) {
          const node = childNodes[i]
          if (node.tagName && node.tagName.toLowerCase().indexOf('h') >= 0) {
            // 遍历到的当前元素标题元素
            const top = getDistanceOffsetTop(node)
            const titleName = node.textContent
            const textIndent =
              Number(node.tagName.toLowerCase().replace('h', '')) * 10
            titles.push({
              top,
              titleName,
              textIndent,
              id: i,
              isActive: false
            })
          }
        }
        titles[0].isActive = true
        // 遍历完成，设置目录
        setCatelog(titles)
      }, 2000)
    }
  }, [viewerRef])
  // 侦听滚动，实时显示当前阅读内容所在的标题
  useEffect(() => {
    if (catelog) {
      // 目录准备好了，开始侦听滚动，根据滚动实时显示当前阅读的标题
      const _catelog = [...catelog]
      document.body.onscroll = () => {
        if (!isListenerScroll.current) {
          return
        }
        if (debounceScrollTimer.current) {
          clearTimeout(debounceScrollTimer.current as number)
          debounceScrollTimer.current = null
        }
        debounceScrollTimer.current = setTimeout(() => {
          const top = window.scrollY
          // 根据这个top对比每个标题的位置，判断当前在阅读哪个标题的内容
          let index = 0
          for (let i = 0; i < _catelog.length; i++) {
            if (_catelog[i].top <= top) {
              index = i
            }
          }
          _catelog.forEach((item: any) => (item.isActive = false))
          _catelog[index].isActive = true
          setCatelog(_catelog)
        }, 200)
      }
    }
  }, [catelog])
  // 跳转目录标题
  const handleJump = useCallback(
    (top: number) => {
      const _catelog = [...catelog]
      const activeTitleIndex = _catelog.findIndex(
        (item: any) => item.top === top
      )
      _catelog.forEach((item: any) => (item.isActive = false))
      _catelog[activeTitleIndex].isActive = true
      setCatelog(_catelog)
      // 跳转完成后延迟一会儿再开启目录滚动侦听
      const openListener = () => {
        setTimeout(() => {
          isListenerScroll.current = true
        }, 500)
      }
      const presentTop = window.scrollY
      // 要跳转的距离
      const distance = Math.abs(presentTop - top)
      const speed = distance / 15
      // 向上还是向下跳转
      const isToTop = presentTop > top
      isListenerScroll.current = false
      let preScrollTop = 0
      const timer = setInterval(() => {
        let scrollTop = 0
        if (document.body.scrollTop) {
          scrollTop = document.body.scrollTop
        } else {
          scrollTop = document.documentElement.scrollTop
        }
        if (preScrollTop === scrollTop) {
          clearInterval(timer)
        }
        preScrollTop = scrollTop
        if (isToTop) {
          // 向上跳转
          if (document.body.scrollTop) {
            if (scrollTop - speed <= top) {
              document.body.scrollTop = top
              clearInterval(timer)
              openListener()
            } else {
              document.body.scrollTop -= speed
            }
          } else {
            if (scrollTop - speed <= top) {
              document.documentElement.scrollTop = top
              clearInterval(timer)
              openListener()
            } else {
              document.documentElement.scrollTop -= speed
            }
          }
        } else {
          // 向下跳转
          // 向下跳转有个问题，如果页面的高度不够跳转到标题所在的高度，定时器无法被关闭
          // 同理，向上跳转也会有这个问题，但因为有封面图的原因，上面的高度总是够的，不够可以添加个条件scrollTop是否为0来
          // 关闭定时器即可
          // 向下跳转可以这样判断，上次和这次的scrollTop是否一样，如果一样也同样关闭定时器
          // 这个方法也适用于向上跳转，因此直接写在timer顶层
          if (document.body.scrollTop) {
            if (scrollTop + speed >= top) {
              document.body.scrollTop = top
              clearInterval(timer)
              openListener()
            } else {
              document.body.scrollTop += speed
            }
          } else {
            if (scrollTop + speed >= top) {
              document.documentElement.scrollTop = top
              clearInterval(timer)
              openListener()
            } else {
              document.documentElement.scrollTop += speed
            }
          }
        }
      }, 10)
    },
    [catelog]
  )
  const classes = classnames('container', {
    'container-dark': isDark
  })
  return (
    <div className="article">
      <PageSurface surface="http:///p8.qhimg.com/t01278eb24731562db5.jpg">
        {detail && (
          <div className="surface-render">
            <h2>{detail.title}</h2>
            <br />
            <div>发布时间：{detail.createAt.split(' ')[0]}</div>
            <br />
            <div>点击量：{detail.viewCount}</div>
          </div>
        )}
      </PageSurface>
      <div className={classes}>
        <div className="article-area">
          {detail && (
            <div className="detail" ref={(e: any) => setViewerRef(e)}>
              <Viewer value={detail.content} plugins={plugins} />
            </div>
          )}
          <div className="catelog">
            <div className="box">
              {catelog
                ? catelog.map((item: any) => {
                    return (
                      <CatelogItem
                        key={item.id}
                        style={{ textIndent: item.textIndent }}
                        active={item.isActive}
                        onClick={() => handleJump(item.top)}
                      >
                        <span>{item.titleName}</span>
                      </CatelogItem>
                    )
                  })
                : '正在加载目录'}
            </div>
          </div>
        </div>
        <div className="link">
          <div>
            <span>文章链接:</span> {location.href}
          </div>
          <div>
            <span>版权说明:</span> 无，随意
          </div>
        </div>
        {detail && (
          <div className="cate-and-tags">
            <div className="item">
              <Space>
                <div>分类</div>
                <Tag color="#90d7ec" className="tag">
                  {detail.cate.name}
                </Tag>
              </Space>
            </div>
            <div className="item">
              <Space>
                <div>标签</div>
                {detail.tags.map((item: any) => {
                  return (
                    <Tag key={item.id} color="#008c8c" className="tag">
                      {item.name}
                    </Tag>
                  )
                })}
              </Space>
            </div>
          </div>
        )}
        {commentList.length && (
          <Comment
            total={commentCount.total}
            totalComment={commentCount.totalComment}
            list={commentList}
            id={id}
            setCommentList={setCommentList}
            setCommentPage={setCommentPage}
          />
        )}
      </div>
    </div>
  )
}
export default React.memo(observer(Article))

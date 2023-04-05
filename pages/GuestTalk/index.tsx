import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import appStore from '../../store/app.Store'
import userStore from '../../store/user.Store'
import messgaeStore from '../../store/messgae.Store'
import { GETTALKLIST, SENDTALK } from '../../request/apis/guestTalk'
import classes from './index.module.scss'
import { TalkItem } from './styled'
import { Popover, Input, Row, Col, Switch } from 'antd'
function GuestTalk() {
  const [talkList, setTalkList] = useState<any[]>([])
  const copyTalkList = useRef<any[]>([])
  const currentIndex = useRef(0)
  const destoryBarrage = useRef(0)
  const debounceSendTalkTimer = useRef<number | null>(null)
  const [barragePlayState, setBarragePlayState] = useState(true)
  const copyPlayState = useRef(true)
  const [newTalk, setNewTalk] = useState('')
  // 弹幕的定时器ID
  const barrageTimer = useRef<number | null>()
  // 获取屏幕宽度
  const clientWidth = useMemo(() => {
    return document.body.clientWidth
  }, [])
  // 获取屏幕高度
  const clientHeight = useMemo(() => {
    return document.body.clientHeight
  }, [])
  // 展示6行，每行的占高
  const barrageHeight = useMemo(() => clientHeight / 6, [])
  // 弹幕播放
  const playBarrage = useCallback(() => {
    if (!barrageTimer.current) {
      barrageTimer.current = setInterval(() => {
        if (destoryBarrage.current !== copyTalkList.current.length) {
          setTalkList(preState => {
            preState = preState.concat(
              ...[[...copyTalkList.current].splice(currentIndex.current * 6, 6)]
            )
            currentIndex.current++
            return preState
          })
        }
        if (destoryBarrage.current === copyTalkList.current.length) {
          // 此轮弹幕播放结束如果设置了不循环播放则清除计时器
          if (copyPlayState.current === false) {
            clearInterval(barrageTimer.current as number)
            barrageTimer.current = null
          }
          currentIndex.current = 0
          destoryBarrage.current = 0
          /*
            如果全部弹幕滚动完毕不设置为空，在下轮弹幕循环执行时会发生以下现象：
            1. 被销毁的第一波弹幕元素复用，此时弹幕元素为前6个，因为第一波弹幕被销毁，导致循环的首波弹幕不可见
            2. 循环的第二波弹幕开始正常，因为复用的元素被循环后的第一波弹幕重置了，第二波弹幕没有相同的key，再次创建
            3. 第二轮弹幕的首波弹幕因为不正确的复用导致异常，并且不会再进行第三轮弹幕，因为上面的两个if条件因为第二波弹幕的
              异常导致都不再满足
            因此在一轮弹幕全部结束时，设置为空，清空被渲染的弹幕列表元素，否则循环后的首波弹幕会因为相同的key而复用导致异常
          */
          setTalkList([])
        }
      }, 3000)
    }
  }, [])
  useEffect(() => {
    appStore.changeShowFooterState(false)
    GETTALKLIST().then(res => {
      if (res.success) {
        const list = res.data
        // 多少波弹幕
        for (let i = 0; i < list.length; i++) {
          const top = i % 6
          list[i].top = (top + 0.5) * barrageHeight + 'px'
          list[i].duration = Math.floor(Math.random() * 2) + 8 + 's'
          list[i].leftWidth = -clientWidth + 'px'
        }
        // 先直接添加一波弹幕
        copyTalkList.current = list
        // 拿到留言数据先渲染第一波
        setTalkList(preState => {
          preState = preState.concat(
            ...[[...copyTalkList.current].splice(currentIndex.current * 6, 6)]
          )
          currentIndex.current++
          return preState
        })
        // 开启弹幕
        playBarrage()
      }
    })
    return () => {
      appStore.changeShowFooterState(true)
    }
  }, [])
  const destoryElement = useCallback((e: any) => {
    e.target.style.display = 'none'
    destoryBarrage.current++
  }, [])
  // 发送弹幕
  const sendBarrage = useCallback((e: any) => {
    const content = e.target.value
    if (e.code === 'Enter') {
      if (!content.trim()) {
        return messgaeStore.call({ type: 'error', message: '请输入留言内容' })
      }
      if (!userStore.userInfo) {
        messgaeStore.call({ type: 'error', message: '请先登录' })
      } else {
        if (debounceSendTalkTimer.current) {
          return messgaeStore.call({
            type: 'info',
            message: '操作太快, 请间隔30秒再试'
          })
        }
        debounceSendTalkTimer.current = setTimeout(() => {
          clearTimeout(debounceSendTalkTimer.current as number)
          debounceSendTalkTimer.current = null
        }, 30 * 1000)
        SENDTALK(content).then(res => {
          if (res.success) {
            messgaeStore.call({ type: 'success', message: '留言成功' })
            const { avatar, nickname } = userStore.userInfo
            const newAddTalk = {
              id: Date.now(),
              top:
                (((copyTalkList.current.length + 1) % 6) + 0.5) *
                  barrageHeight +
                'px',
              duration: Math.floor(Math.random() * 2) + 8 + 's',
              leftWidth: -clientWidth + 'px',
              avatar,
              nickname,
              content,
              createAt: '刚刚'
            }
            copyTalkList.current.push(newAddTalk)
            setNewTalk('')
          }
        })
      }
    }
  }, [])
  // 改变弹幕播放状态
  const changeBarragePlayState = useCallback((state: boolean) => {
    // playState使用ref来存储的话有个问题，就是改变了playState但会在下一次render执行才会更新到页面上，
    // 因此还是采用state存储playState，但state有个问题，在播放弹幕的计时器中，由于异步问题始终拿到弹幕计时器开始那一刻的状态
    // 因此，除了playState的state存储外，还需要一个ref来存储playState的备份。
    setBarragePlayState(state)
    copyPlayState.current = state
    playBarrage()
  }, [])
  // 输入留言
  const inputTalk = useCallback((e: any) => {
    // 事件对象不可异步获取
    const content = e.target.value
    setNewTalk(content)
  }, [])
  return (
    <div className={classes['guest-talk']}>
      <Row className={classes['control']} gutter={40}>
        <Col>
          <Input
            type="primary"
            size="small"
            placeholder="Enter发送弹幕~"
            value={newTalk}
            onInput={inputTalk}
            onKeyUp={sendBarrage}
          />
        </Col>
        <Col>
          <span style={{ color: '#fff', marginRight: '5px', fontSize: '14px' }}>
            是否轮播?
          </span>
          <Switch
            checked={barragePlayState}
            onChange={changeBarragePlayState}
            disabled={!copyTalkList.current.length}
          ></Switch>
        </Col>
      </Row>
      {talkList.map((item: any, index: number) => {
        return (
          <Popover
            key={item.id}
            content={item.content}
            title={`${item.nickname}在${item.createAt}的留言`}
          >
            <TalkItem
              top={item.top}
              duration={item.duration}
              leftWidth={item.leftWidth}
              onAnimationEnd={destoryElement}
            >
              <img src={item.avatar} alt="" />
              <span className="name">{item.nickname}:</span>
              <span className="content">{item.content}</span>
            </TalkItem>
          </Popover>
        )
      })}
    </div>
  )
}
export default GuestTalk

import React, { useCallback, useRef, useState } from 'react'
import CommentForm from './CommentForm'
import { observer } from 'mobx-react-lite'
import { Button } from 'antd'
import userStore from '../../store/user.Store'
import { SENDCOMMENT, ENDORSECOMMENT } from '../../request/apis/articles'
import messgaeStore from '../../store/messgae.Store'
import { fromJS } from 'immutable'
interface Props {
  totalComment: number
  total: number
  list: any[]
  id: string
  setCommentList: any
  setCommentPage: any
}
function Comment(props: Props) {
  const { totalComment, total, list, id, setCommentList, setCommentPage } =
    props
  // 发布评论的节流计时器
  const debounceSendCommentTimer = useRef<number | null>()
  // 当前回复的评论
  const [currentReplyInfo, setCurrentReplyInfo] = useState({
    parentId: 0,
    replyId: 0,
    userId: 0
  })
  // 开始回复
  const startReply = useCallback(
    (parentId: number, replyId?: number, userId?: number) => {
      setCurrentReplyInfo({
        parentId,
        replyId: replyId ?? 0,
        userId: userId ?? 0
      })
    },
    []
  )
  // 发布一级评论
  const releaseNewComment = useCallback((htmlContent: string) => {
    if (debounceSendCommentTimer.current) {
      return messgaeStore.call({
        type: 'error',
        message: '请间隔一会儿再发布'
      })
    }
    debounceSendCommentTimer.current = setTimeout(() => {
      clearTimeout(debounceSendCommentTimer.current as number)
      debounceSendCommentTimer.current = null
    }, 10 * 1000)
    SENDCOMMENT({
      content: htmlContent,
      articleId: Number(id)
    }).then(res => {
      if (res.success) {
        messgaeStore.call({ type: 'success', message: '发布成功' })
        const { city, commentId } = res
        setCommentList((prevState: any) => {
          const { nickname, avatar, id: user_id } = userStore.userInfo
          const list = [...prevState]
          list.unshift({
            id: commentId,
            city,
            content: htmlContent,
            createAt: '刚刚',
            endorse: [],
            replyList: [],
            nickname: nickname,
            avatar: avatar,
            parent_id: null,
            user_id,
            showCount: 4
          })
          setCurrentReplyInfo({
            userId: 0,
            parentId: 0,
            replyId: 0
          })
          return list
        })
      }
    })
  }, [])
  // 发布回复的评论
  const releaseComment = useCallback(
    (htmlContent: string) => {
      if (debounceSendCommentTimer.current) {
        return messgaeStore.call({
          type: 'error',
          message: '请间隔一会儿再发布'
        })
      }
      debounceSendCommentTimer.current = setTimeout(() => {
        clearTimeout(debounceSendCommentTimer.current as number)
        debounceSendCommentTimer.current = null
      }, 10 * 1000)
      const { parentId, replyId, userId } = currentReplyInfo
      SENDCOMMENT({
        articleId: Number(id),
        parentId: parentId ? parentId : undefined,
        replyId: userId ? userId : undefined,
        content: htmlContent
      }).then(res => {
        if (res.success) {
          messgaeStore.call({ type: 'success', message: '回复成功' })
          // 找到被回复的评论，然后添加进去
          const index = list.findIndex((item: any) => item.id === parentId)
          let replyName = ''
          if (replyId) {
            const index2 = list[index].replyList.findIndex(
              (item: any) => item.id === replyId
            )
            replyName = list[index].replyList[index2].nickname
          }
          const { city, commentId } = res
          const newList = [...list]
          const { nickname, avatar, id: user_id } = userStore.userInfo
          newList[index].replyList.unshift({
            articleId: id,
            id: commentId,
            city,
            content: htmlContent,
            createAt: '刚刚',
            endorse: [],
            nickname: nickname,
            avatar: avatar,
            parent_id: parentId,
            user_id
          })
          setCommentList(newList)
          setCurrentReplyInfo({
            userId: 0,
            parentId: 0,
            replyId: 0
          })
        }
      })
    },
    [currentReplyInfo]
  )
  // 查看更多子评论
  const loadMoreChildComment = useCallback(
    (id: number) => {
      setCommentList((prevState: any) => {
        const list = [...prevState]
        const index = list.findIndex((item: any) => item.id === id)
        list[index].showCount += 4
        return list
      })
    },
    [setCommentList]
  )
  // 加载更多评论
  const loadMoreComment = useCallback(() => {
    setCommentPage((prevState: number) => {
      return prevState + 1
    })
  }, [setCommentPage])
  // 评论点赞
  const handleEndorse = (commentId: number) => {
    if (!userStore.userInfo) {
      return messgaeStore.call({ type: 'error', message: '请先登录' })
    }
    ENDORSECOMMENT(commentId).then(res => {
      if (res.success) {
        const isEndorse = res.endorse
        // 找到被点赞的评论
        let index = 0
        let index2 = -1
        list.findIndex((item: any, i: number) => {
          if (item.id === commentId) {
            index = i
            return true
          }
          item.replyList.findIndex((item2: any, i2: number) => {
            if (item2.id === commentId) {
              index = i
              index2 = i2
              return true
            }
          })
        })
        const newList = fromJS(list)
        const id = userStore.userInfo.id
        if (isEndorse) {
          messgaeStore.call({ type: 'success', message: '点赞成功' })
          if (index2 !== -1) {
            const list = newList.updateIn(
              [index, 'replyList', index2, 'endorse'],
              (val: any) => val.push(id)
            )
            setCommentList(list.toJS())
          } else {
            const list = newList.updateIn([index, 'endorse'], (val: any) =>
              val.push(id)
            )
            setCommentList(list.toJS())
          }
        } else {
          messgaeStore.call({ type: 'success', message: '取消点赞' })
          if (index2 !== -1) {
            const i = newList
              .toJS()
              [index]['replyList'][index2]['endorse'].findIndex(
                (item: any) => item.id === id
              )
            const list = newList.updateIn(
              [index, 'replyList', index2, 'endorse'],
              (val: any) => val.splice(i, 1)
            )
            setCommentList(list.toJS())
          } else {
            const i = newList
              .toJS()
              [index].endorse.findIndex((item: any) => item === id)
            const list = newList.updateIn([index, 'endorse'], (val: any) =>
              val.splice(i, 1)
            )
            setCommentList(list.toJS())
          }
        }
      }
    })
  }
  return (
    <div className="comment">
      <CommentForm release={releaseNewComment} />
      <div className="title title2">
        <div className="iconfont icon-liuyan"></div>
        <span>{totalComment}条评论</span>
      </div>
      <div className="list">
        {list.map((item: any) => {
          return (
            <div key={item.id} className="item">
              <div className="top">
                <img className="avatar" src={item.avatar} alt="" />
                <div className="info">
                  <div className="left">
                    <div className="nickname">
                      <span>{item.nickname}</span>
                      <div className="addr">发布于: {item.city}</div>
                    </div>
                    <div className="time">{item.createAt.split(' ')[0]}</div>
                    <div className="control">
                      <div
                        className="endorse"
                        style={{
                          color: item.endorse.includes(userStore.userInfo?.id)
                            ? '#90d7ec'
                            : '#000'
                        }}
                        onClick={() => handleEndorse(item.id)}
                      >
                        <i className="iconfont icon-_endorsement"></i>
                        <span>{item.endorse.length}</span>
                      </div>
                      <div className="reply">
                        <i className="iconfont icon-liuyan"></i>
                        <span>{item.replyList.length}</span>
                      </div>
                    </div>
                    <div
                      className="content"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    ></div>
                    {currentReplyInfo.parentId === item.id &&
                      currentReplyInfo.replyId === 0 && (
                        <CommentForm release={releaseComment} />
                      )}
                  </div>
                  <div className="right" onClick={() => startReply(item.id)}>
                    回复
                  </div>
                </div>
              </div>
              {/* 二级评论 */}
              <div className="bottom">
                {[...item.replyList]
                  .splice(0, item.showCount)
                  .map((item2: any) => {
                    return (
                      <div key={item2.id} className="item2">
                        <img className="avatar" src={item2.avatar} alt="" />
                        <div className="info">
                          <div className="left">
                            <div className="nickname">
                              <span>{item2.nickname}</span>
                              <div className="addr">发布于: {item2.city}</div>
                            </div>
                            <div className="time">
                              {item2.createAt.split(' ')[0]}
                            </div>
                            <div className="control">
                              <div
                                className="endorse"
                                style={{
                                  color: item2.endorse.includes(
                                    userStore.userInfo?.id
                                  )
                                    ? '#90d7ec'
                                    : '#000'
                                }}
                                onClick={() => handleEndorse(item2.id)}
                              >
                                <i className="iconfont icon-_endorsement"></i>
                                <span>{item2.endorse.length}</span>
                              </div>
                            </div>
                            <div
                              className="content"
                              dangerouslySetInnerHTML={{
                                __html: item2.content
                              }}
                            ></div>
                            {currentReplyInfo.replyId === item2.id && (
                              <CommentForm release={releaseComment} />
                            )}
                          </div>
                          <div
                            className="right"
                            onClick={() =>
                              startReply(item.id, item2.id, item.user_id)
                            }
                          >
                            回复
                          </div>
                        </div>
                      </div>
                    )
                  })}
                <div
                  style={{
                    display:
                      item.replyList.length &&
                      item.showCount < item.replyList.length
                        ? 'block'
                        : 'none'
                  }}
                  className="more"
                  onClick={() => loadMoreChildComment(item.id)}
                >
                  共{item.replyList.length}条子评论, <span>点击查看更多</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div
        className="load-more"
        style={{ display: list.length < total ? 'flex' : 'none' }}
      >
        <Button type="primary" size="small" onClick={loadMoreComment}>
          加载更多
        </Button>
      </div>
    </div>
  )
}
export default React.memo(observer(Comment))

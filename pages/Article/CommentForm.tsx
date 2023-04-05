import React, { useCallback, useState } from 'react'
import userStore from '../../store/user.Store'
import messgaeStore from '../../store/messgae.Store'
import { Button } from 'antd'

import defaultAvatar from '../../assets/images/default-avatar.svg'
import emoji from '../../assets/images/emoji.svg'
import emojiList from '../../assets/js/emoji'

import './commentForm.scss'
import { observer } from 'mobx-react-lite'

// 格式化emojiList
const _emojiList: { key: string; url: string }[] = []
for (const key in emojiList) {
  _emojiList.push({
    key,
    url: (emojiList as any)[key]
  })
}

interface Props {
  release: (htmlContent: string) => void
}
function CommentForm(props: Props) {
  // 评论内容
  const [commentContent, setCommentContent] = useState('')
  // 打开表情列表
  const [isShowEmojiList, setIsShowEmojiList] = useState(false)
  // 添加标签
  const addEmoji = useCallback(
    (key: string) => {
      setCommentContent(prevState => prevState + key)
    },
    [commentContent]
  )
  // 输入内容
  const handleInput = useCallback(
    (e: any) => {
      setCommentContent(e.target.value)
    },
    [commentContent]
  )
  // 确认评论
  const toComment = useCallback(() => {
    if (!userStore.userInfo) {
      return messgaeStore.call({ type: 'info', message: '请先登录' })
    }
    if (!commentContent.trim()) {
      return messgaeStore.call({ type: 'info', message: '请输入评论内容' })
    }
    // 表情占位符转图片
    let content = commentContent
    for (let i = 0; i < _emojiList.length; i++) {
      if (content.indexOf(_emojiList[i].key) >= 0) {
        let key: any = _emojiList[i].key.split('')
        key.unshift('\\')
        key.splice(key.length - 1, 0, '\\')
        key = key.join('')
        console.log(eval(`/${key}/g`))
        content = content.replace(
          eval(`/${key}/g`),
          `<img style="width: 20px; height: 20px; border-radius: 50%" src="${_emojiList[i].url}" />`
        )
      }
    }
    content = `<div style="display: flex; align-items: center">${content}</div>`
    props.release(content)
  }, [commentContent])
  return (
    <div className="comment-form">
      <div className="title">
        <i className="iconfont icon-liuyan"></i>
        <span>评论</span>
      </div>
      <div className="form">
        <img
          style={{ display: userStore.userInfo ? 'block' : 'none' }}
          className="avatar"
          src={userStore.userInfo?.avatar}
          alt=""
        />
        <img
          style={{ display: userStore.userInfo ? 'none' : 'block' }}
          className="avatar"
          src={defaultAvatar}
          alt=""
        />
        <div className="textarea">
          <textarea
            placeholder="留下一个和谐的评论吗?"
            value={commentContent}
            onInput={handleInput}
          ></textarea>
          <div className="control">
            <img
              src={emoji}
              alt=""
              onClick={() => setIsShowEmojiList(prevState => !prevState)}
            />
            <div className="btn">
              <Button type="primary" size="small" onClick={toComment}>
                评论
              </Button>
            </div>
          </div>
          <div
            className="emoji-list"
            style={{ display: isShowEmojiList ? 'block' : 'none' }}
          >
            {_emojiList.map(item => {
              return (
                <img
                  key={item.key}
                  src={item.url}
                  alt=""
                  title={item.key.replace(/(\[|\])/g, '')}
                  onClick={() => addEmoji(item.key)}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
export default React.memo(observer(CommentForm))

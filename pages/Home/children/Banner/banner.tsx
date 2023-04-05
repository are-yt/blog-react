import React, { useEffect, useState, useRef, useCallback } from 'react'
import { message } from 'antd'
import { GETSHICI } from '../../../../request/apis/home'
import { SAVESHICITOKEN, GETSHICITOKEN } from '../../../../utils/local'
import './banner.scss'
const domRef = React.createRef<HTMLParagraphElement>()
function Banner() {
  const [content, setContent] = useState('')
  const contentRef = useRef('')
  const [messageAPI] = message.useMessage()
  useEffect(() => {
    document.onscroll = () => {
      const y = window.scrollY
      const x = window.scrollX
      if (domRef.current) {
        domRef.current!.style.backgroundPosition = `${x}px ${y}px`
      }
    }
  }, [])
  const inputContent = useCallback(() => {
    const length = contentRef.current.length
    let index = 0
    function input() {
      let delay = 1000
      if (index <= 1) {
        delay = 1000
      } else if (index <= 5) {
        delay = 400
      } else {
        delay = 150
      }
      const timer = setTimeout(() => {
        if (index === length) {
          return clearTimeout(timer)
        } else {
          setContent(preContent => {
            input()
            return preContent + contentRef.current[index++]
          })
        }
      }, delay)
    }
    input()
  }, [])
  useEffect(() => {
    // 获取随机诗词
    const token = GETSHICITOKEN()
    GETSHICI(token)
      .then(res => {
        if (res.code === 200) {
          const { token, content } = res
          // 保存诗词token
          SAVESHICITOKEN(token)
          // 更新诗词内容
          contentRef.current = content
          // 拿到诗词后转为打字的形式渐进输出
          inputContent()
        }
      })
      .catch(err => {
        messageAPI.open({
          type: 'error',
          content: err.message
        })
      })
  }, [])
  return (
    <div className="home-banner">
      <div className="content">
        <span>{content}</span>
        {contentRef.current !== content && <div className="cursor"></div>}
      </div>
      <div className="background">
        <div ref={domRef} className="gretting">
          <span>你好~</span>
        </div>
      </div>
    </div>
  )
}
export default Banner

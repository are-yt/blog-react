import React, { useCallback } from 'react'
import { Tag, Space } from 'antd'
import themeStore from '../../../../store/theme.Store'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import classnames from 'classnames'
function ArticleItem(props: any) {
  const navigate = useNavigate()
  const { id, content, title, cateName, createAt, surface, tags, viewCount } =
    props
  const surfaceStyle = {
    background: `url(${surface}) no-repeat`,
    backgroundSize: '100%',
    backgroundPosition: 'center'
  }
  const mouseToSurface = useCallback((e: any) => {
    e.target.style.backgroundSize = '150%'
  }, [])
  const mouseLeaveSurface = useCallback((e: any) => {
    e.target.style.backgroundSize = '100%'
  }, [])
  const classes = classnames('article-item', {
    'article-item-dark': themeStore.currentTheme === 'dark'
  })
  const detail = useCallback(() => {
    navigate(`/article/${id}`)
  }, [])
  return (
    <div className={classes} onClick={detail}>
      <div
        className="surface"
        style={surfaceStyle}
        onMouseEnter={mouseToSurface}
        onMouseLeave={mouseLeaveSurface}
      ></div>
      <div className="info">
        <div className="title">{title}</div>
        <br />
        <Space className="time">
          <Space>
            <span>发表时间</span>
            <span>{createAt.split(' ')[0]}</span>
          </Space>
          <Space>
            <span>阅读量</span>
            <span>{viewCount}</span>
          </Space>
        </Space>
        <Space wrap>
          <div className="cate">
            <Space>
              <span>分类</span>
              <Tag color="#90d7ec">{cateName}</Tag>
            </Space>
          </div>
          <div className="tags">
            <Space>
              <span>标签</span>
              {tags.map((item: any) => {
                return (
                  <Tag key={item} color="#90d7ec">
                    {item}
                  </Tag>
                )
              })}
            </Space>
          </div>
        </Space>
        <div className="content">{content}</div>
      </div>
    </div>
  )
}
export default React.memo(observer(ArticleItem))

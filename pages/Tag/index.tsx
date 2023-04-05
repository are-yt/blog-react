import React, { useEffect, useState, useMemo, useCallback } from 'react'
import PageSurface from '../../components/PageSurface'
import { GETTAGLIST } from '../../request/apis/tag'
import themeStore from '../../store/theme.Store'
import { observer } from 'mobx-react-lite'
import classnames from 'classnames'
import { useNavigate } from 'react-router-dom'
import './index.scss'
function Tag() {
  const navigate = useNavigate()
  const isDark = themeStore.currentTheme === 'dark'
  const [tags, setTags] = useState([])
  useEffect(() => {
    GETTAGLIST().then(res => {
      if (res.success) {
        setTags(res.list)
      }
    })
  }, [])
  const fontSizeList = useMemo(() => {
    return [18, 20, 14, 15, 16]
  }, [])
  const computedFontSize = useMemo(() => {
    return () => {
      return fontSizeList[Math.floor(Math.random() * fontSizeList.length)]
    }
  }, [])
  const classes = classnames('tag', {
    'tag-dark': isDark
  })
  const toFiltrate = useCallback((name: string, id: number) => {
    navigate(`/filtrate/1/${name}?id=${id}`)
  }, [])
  return (
    <div className={classes}>
      <PageSurface
        surface="http:///p6.qhimg.com/t015c7bbab0a42e2cf9.jpg"
        title="标签"
      />
      <div className="container">
        <p className="title">标签-{tags.length}</p>
        <div className="list">
          {tags.map((item: any) => {
            return (
              <div
                key={item.id}
                className="item"
                style={{ fontSize: computedFontSize() }}
                onClick={() => toFiltrate(item.name, item.id)}
              >
                {item.name}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default React.memo(observer(Tag))

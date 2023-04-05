import React, { useCallback, useEffect, useState } from 'react'
import PageSurface from '../../components/PageSurface'
import { GETCATELIST } from '../../request/apis/cate'
import themeStore from '../../store/theme.Store'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import classnames from 'classnames'
import './index.scss'
function Cate() {
  const navigate = useNavigate()
  const isDark = themeStore.currentTheme === 'dark'
  const [cates, setCates] = useState([])
  useEffect(() => {
    GETCATELIST().then(res => {
      if (res.success) {
        setCates(res.list)
      }
    })
  }, [])
  const classes = classnames('cate', {
    'cate-dark': isDark
  })
  const toFiltrate = useCallback((name: string, id: number) => {
    navigate(`/filtrate/0/${name}?id=${id}`)
  }, [])
  return (
    <div className={classes}>
      <PageSurface
        surface="http:///p1.qhimg.com/t018323ba52df7c80fa.jpg"
        title="分类"
      />
      <div className="container">
        <p className="title">分类-{cates.length}</p>
        {cates.map((item: any) => {
          return (
            <div
              key={item.id}
              className="item"
              onClick={() => toFiltrate(item.name, item.id)}
            >
              <div className="circle"></div>
              <div className="cate-name">{item.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default React.memo(observer(Cate))

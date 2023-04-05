import React, { useEffect, useState } from 'react'
import { GETHOMEARTICLELIST } from '../../../../request/apis/home'
import ArticleItem from './item'
import './index.scss'
function ArticleList() {
  const [list, setList] = useState([])
  useEffect(() => {
    GETHOMEARTICLELIST().then(res => {
      if (res.code === 200) {
        setList(res.list)
      }
    })
  }, [])
  return (
    <div className="article-list">
      {list.map((item: any, index) => {
        return <ArticleItem key={item.id} {...item} index="index" />
      })}
    </div>
  )
}
export default React.memo(ArticleList)

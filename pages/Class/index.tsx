import React, { useEffect, useState, useCallback, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import PageSurface from '../../components/PageSurface'
import { GETCLASSLIST } from '../../request/apis/class'
import themeStore from '../../store/theme.Store'
import classnames from 'classnames'
import { Pagination } from 'antd'
import './index.scss'
const size = 4
function Classfication() {
  const navigate = useNavigate()
  const isDark = themeStore.currentTheme === 'dark'
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  let preDate = ''
  const getList = () => {
    GETCLASSLIST(currentPage - 1, size).then(res => {
      if (!res.success) {
        return
      }
      setList(res.list)
      setTotal(res.total)
    })
  }
  useEffect(() => {
    getList()
  }, [currentPage])
  // 暗黑主题样式类
  const classes = classnames('classification', {
    'classification-dark': isDark
  })
  // 切换分页
  const changeCurrentPage = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])
  // 计算月份，根据不同月份标识分类
  const computedDate = (date: string) => {
    date = date.substring(0, 7)
    if (preDate !== date) {
      preDate = date
      return <p className="date">{date}</p>
    }
  }
  console.log(list)
  return (
    <div className={classes}>
      <PageSurface
        surface="http:///p2.qhimg.com/t012665f44a5971d3c4.jpg"
        title="归档"
      />
      <div className="list">
        {list.map((item: any) => {
          return (
            <div key={item.id} className="item-wrapper">
              {computedDate(item.createAt)}
              <div
                className="item"
                onClick={() => navigate(`/article/${item.id}`)}
              >
                <div
                  className="surface"
                  style={{ backgroundImage: `url(${item.surface})` }}
                ></div>
                <div className="info">
                  <div className="title">{item.title}</div>
                  <div className="time">{item.createAt.split(' ')[0]}</div>
                  <div className="content">{item.content}</div>
                </div>
              </div>
            </div>
          )
        })}
        <div className="pagination">
          <Pagination
            current={currentPage}
            total={total}
            defaultPageSize={size}
            onChange={changeCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}
export default React.memo(observer(Classfication))

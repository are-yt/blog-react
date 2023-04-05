import React, { useCallback, useEffect, useRef, useState } from 'react'
import PageSurface from '../../components/PageSurface'
import { useParams, useSearchParams, useLocation } from 'react-router-dom'
import { FILTRATEARTICLE } from '../../request/apis/articles'
import { useNavigate } from 'react-router-dom'
import { Tag, Space, Divider, Pagination } from 'antd'
import './index.scss'
const pageSize = 6
function Filtrate() {
  const navigate = useNavigate()
  const { type, name } = useParams() as { type: any; name: any }
  const id: any = useSearchParams(useLocation().pathname)[0].get('id')
  // 页码
  const [pageNumber, setPageNumber] = useState(0)
  // 当前类别下的文章总数
  const totalArticle = useRef(0)
  // 当前页码的文章列表
  const [list, setList] = useState([])
  useEffect(() => {
    if (!id) {
      console.log('id')
      return navigate(-1)
    } else if (type * 1 != 0 && type * 1 != 1) {
      return navigate(-1)
    }
  }, [])
  const title = `${type === '0' ? '分类' : '标签'} -- ${name}`
  // 根据标签/分类获取对应的文章
  const getFiltrateArticles = useCallback((offset: number, size: number) => {
    FILTRATEARTICLE({
      type: (type * 1) as 0 | 1,
      id: id * 1,
      offset,
      size
    }).then(res => {
      if (res.success) {
        totalArticle.current = res.total
        setList(res.list)
      }
    })
  }, [])
  useEffect(() => {
    getFiltrateArticles(pageNumber, pageSize)
  }, [id, type, name])
  const toFiltrate = useCallback((id: number, name: string, type: 0 | 1) => {
    // 此路由组件会被复用，因此先跳往中转路由，由中转路由跳转回来
    navigate(`/transit/${type}/${name}/${id}`)
  }, [])
  // 切换页码
  const handleChangePage = useCallback(
    (page: number) => {
      setPageNumber(page - 1)
      getFiltrateArticles(pageNumber, pageSize)
    },
    [pageNumber]
  )
  return (
    <div className="filtrate">
      <PageSurface
        surface="http:///p5.qhimg.com/t012387ebed588f2b55.jpg"
        title={title}
      />
      <div className="container">
        <div className="list">
          {list.map((item: any) => {
            return (
              <div
                key={item.id}
                className="item"
                onClick={() => navigate(`/article/${item.id}`)}
              >
                <div
                  className="surface"
                  style={{
                    background: `url(${item.surface})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <div className="content">
                  <h3>{item.title}</h3>
                  <div className="time">
                    <span>{item.createAt.split(' ')[0]}</span>
                    <Tag
                      className="tag"
                      color="#008c8c"
                      onClick={() =>
                        toFiltrate(item.cate.id, item.cate.name, 0)
                      }
                    >
                      {item.cate.name}
                    </Tag>
                  </div>
                  <Divider />
                  <Space wrap size="middle">
                    {item.tags.map((item: any) => {
                      return (
                        <Tag
                          className="tag"
                          key={item.id}
                          color="#90d7ec"
                          onClick={() => toFiltrate(item.id, item.name, 1)}
                        >
                          {item.name}
                        </Tag>
                      )
                    })}
                  </Space>
                </div>
              </div>
            )
          })}
        </div>
        <div className="pagination">
          <Pagination
            pageSize={pageSize}
            current={pageNumber + 1}
            total={totalArticle.current}
            onChange={handleChangePage}
          />
        </div>
      </div>
    </div>
  )
}
export default React.memo(Filtrate)

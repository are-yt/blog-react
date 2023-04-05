import React, { ReactNode } from 'react'
import './index.scss'
interface Props {
  surface: string
  title?: string
  children?: ReactNode
}
function PageSurface(props: Props) {
  const { surface, title, children } = props
  return (
    <div id="page-surface" style={{ backgroundImage: `url(${surface})` }}>
      <div className="title" style={{ display: children ? 'none' : 'block' }}>
        {title}
      </div>
      <div
        className="render-content"
        style={{ display: children ? 'block' : 'none' }}
      >
        {children}
      </div>
    </div>
  )
}
export default React.memo(PageSurface)

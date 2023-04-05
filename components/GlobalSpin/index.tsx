import React from 'react'
import ReactDOM from 'react-dom'
import { Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import spinStore from '../../store/showSpin.Store'
import './index.scss'
function GlobalSpin() {
  const spinDom = document.getElementById('spin')
  if (!spinDom) {
    // 没有spin挂载的节点，创建并添加
    const node = document.createElement('div')
    node.setAttribute('id', 'spin')
    document.body.appendChild(node)
  }
  if (!spinStore.showSpin) {
    return <div className="no-spin"></div>
  }
  return ReactDOM.createPortal(
    <div className="spin-active">
      <Spin delay={300} size="default" spinning={true} />
    </div>,
    document.getElementById('spin') as HTMLElement
  )
}
export default React.memo(observer(GlobalSpin))

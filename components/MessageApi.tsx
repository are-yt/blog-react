import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { message } from 'antd'
import messageStore from '../store/messgae.Store'
function MessageApi() {
  useEffect(() => {
    if (messageStore.callCount !== 0) {
      const { type, message: content, callCount } = messageStore
      // 首次挂载到组件上不渲染
      // const destroy = callCount - 1
      // if (destroy !== 0) {
      //   message.destroy(destroy)
      // }
      message.open({
        key: messageStore.callCount,
        type,
        content
      })
    }
    // 通过下面的实践得知，此组件的render里没有对发生更改的messageStore的使用,因此不会触发render的执行,
    // 因此这里添加一个依赖，否则在messageStore发生更改时会触发shouldComponentUpdate() return false的行为,
    // 导致此组件的不会执行render，不重新执行render，那么新的提示也就无法发出了
  }, [messageStore.callCount])
  return <></>
}
// 直接暴露组件有问题，当外部组件发生更改，此组件函数会重新执行，意外的发出提示，这不是这个函数组件应该的行为
// export default MessageApi

// 通过实践，发现经过observer做处理的组件有类似React.memo()一样的效果，外部组件的非相关props的更改不会触发此组件函数重新执行
// 还发现，若该组件里的render没有对发生更改的store的使用，会触发类似shouldComponentUpdate() return false一样的效果，此时的
// 该组件也不会重新执行render
export default observer(MessageApi)

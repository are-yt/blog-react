import React from 'react'
import useRouterConfig from '../router'
import NProgress from '../utils/nprogress'
import FallBack from './Fallback'
function RouterConfig() {
  NProgress.start()
  const routes = useRouterConfig()
  React.useEffect(() => {
    NProgress.done()
  })
  return (
    <>
      <React.Suspense fallback={<FallBack />}>{routes}</React.Suspense>
    </>
  )
}
export default React.memo(RouterConfig)

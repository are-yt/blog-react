import { useRoutes, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import React from 'react'
const Classfication = React.lazy(() => import('../pages/Class'))
const Cate = React.lazy(() => import('../pages/Cate'))
const Tag = React.lazy(() => import('../pages/Tag'))
const GuestTalk = React.lazy(() => import('../pages/GuestTalk'))
const Profile = React.lazy(() => import('../pages/Profile'))
const Filtrate = React.lazy(() => import('../pages/Filtrate'))
const Transit = React.lazy(() => import('../pages/Transit'))
const Article = React.lazy(() => import('../pages/Article'))
function useRouterConfig() {
  const routes = useRoutes([
    {
      path: '/home',
      element: <Home />
    },
    {
      path: '/class',
      element: <Classfication />
    },
    {
      path: '/cate',
      element: <Cate />
    },
    {
      path: '/tag',
      element: <Tag />
    },
    {
      path: '/guest-talk',
      element: <GuestTalk />
    },
    {
      path: '/profile',
      element: <Profile />
    },
    {
      path: '/filtrate/:type/:name',
      element: <Filtrate />
    },
    {
      path: '/transit/:type/:name/:id',
      element: <Transit />
    },
    {
      path: '/article/:id',
      element: <Article />
    },
    {
      path: '*',
      element: <Navigate to="/home" />
    }
  ])
  return routes
}
export default useRouterConfig

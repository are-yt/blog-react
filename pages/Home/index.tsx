import Banner from './children/Banner/banner'
import ArticleList from './children/ArticleList'
import BasicInfo from './children/BasicInfo'
import './index.scss'
export default function Home() {
  return (
    <div className="home">
      <Banner />
      <div className="main">
        <ArticleList />
        <BasicInfo />
      </div>
    </div>
  )
}

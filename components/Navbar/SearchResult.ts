import styled from 'styled-components'
const SearchResult = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  box-shadow: 0 0 10px 1px #cccccc80;
  padding: 10px;
  border-radius: 5px;
  transition: transform 0.5s;
  cursor: pointer;
  &:hover {
    transform: translateY(-10px);
  }
  .surface {
    width: 138px;
    height: 116px;
    border-radius: 20px;
    background: ${(props: any) => `url(${props.url}) no-repeat`};
    background-size: 100%;
    background-position: center;
    transition: all 0.5s;
    &:hover {
      background-size: 150%;
    }
  }
  .info {
    width: 0;
    flex: 0.95;
    color: #8a8a8a;
    .time {
      font-size: 12px;
      span:nth-child(2) {
        margin-left: 1rem;
        color: #ccc;
      }
      margin: 1rem 0;
    }
    .content {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      font-size: 12px;
    }
  }
`
export default SearchResult

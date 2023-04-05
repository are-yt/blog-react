import styled from 'styled-components'
const CatelogItem = styled.div`
  padding: 0 10px;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  background: ${(props: any) => (props.active ? '#90d7ec' : '')};
  color: ${(props: any) => (props.active ? '#fff' : '#000')};
  &:hover {
    background: #90d7ec60;
    color: #fff;
  }
`
export default CatelogItem

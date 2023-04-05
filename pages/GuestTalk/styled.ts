import styled from 'styled-components'
export const TalkItem = styled.div`
  &:hover {
    animation-play-state: paused;
  }
  position: absolute;
  top: ${(props: any) => props.top};
  right: 0;
  transform: translateX(100%);
  animation: moveToLeft ${(props: any) => props.duration} linear forwards;
  @keyframes moveToLeft {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(${(props: any) => props.leftWidth});
    }
  }
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 20px;
  background: #ffffff80;
  cursor: pointer;
  img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
  }
  .name {
    margin: 0 6px;
  }
  .content {
    letter-spacing: 3px;
  }
`

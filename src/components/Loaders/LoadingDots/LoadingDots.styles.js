import styled, { keyframes } from 'styled-components';

const BounceAnimation = keyframes`
0%, 80%, 100% { 
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% { 
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
`;
export const DotWrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;
export const Dot = styled.div`
  background-color: #888;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin: 0 3px;
  /* Animation */
  animation: ${BounceAnimation} 1.5s linear infinite;
  animation-delay: ${(props) => props.delay};
  -webkit-animation: ${BounceAnimation} 1.5s linear infinite;
  -webkit-animation-delay: ${(props) => props.delay};
`;

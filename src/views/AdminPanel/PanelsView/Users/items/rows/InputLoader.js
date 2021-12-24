import styled, { keyframes } from 'styled-components';
import { TCV_DEFAULT } from 'constant/CssVariables';

const InputLoader = () => {
  return (
    <LoaderContainer>
      <div></div>
      <div></div>
    </LoaderContainer>
  );
};
const ripple = keyframes`
  0% {
    top: 1.2rem;
    left: 1.2rem;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0;
    left: 0;
    width: 2.4rem;
    height: 2.4rem;
    opacity: 0;
  }
`;
const LoaderContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 2.4rem;
  height: 2.4rem;
  padding: 0.3rem;

  & div {
    position: absolute;
    border: 3px solid ${TCV_DEFAULT};
    opacity: 1;
    border-radius: 100%;
    animation: ${ripple} 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }

  & div:nth-child(2) {
    animation-delay: -0.5s;
  }
`;

export default InputLoader;

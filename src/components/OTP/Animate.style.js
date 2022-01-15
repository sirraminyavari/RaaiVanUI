import styled, { css, keyframes } from 'styled-components';

const right = keyframes`

  0%   {right: -1%}
  25%  {right: 1%}
  50%  {right: -1%}
  75%  {right: 1%}
  100% {right: -1%}
`;
// It's useful for times that the user inputted wrong info, shakes the component in the x-axis.
export const ShakeAnimate = styled.div`
  position: relative;

  animation: ${({ isVisible }) =>
    isVisible &&
    css`
      ${right} 0.2s
    `};
  width: 100%;
  display: flex;
  flex-direction: row;
`;

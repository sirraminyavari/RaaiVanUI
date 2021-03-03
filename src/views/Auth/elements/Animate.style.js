import styled, { css, keyframes } from 'styled-components';

const up = keyframes`
  from {
    top: -2rem;
    z-index: -2;

  }

  to {
   top:0rem;
   z-index:1;

  }
`;
const down = (dimension) => {
  return keyframes`
  from {
    z-index:1;
    top:${dimension?.top - dimension?.height}px;
    width:${dimension?.width}px;

  }

  to {
   z-index: -2;
   top:${20 + dimension?.top}px;
   width:${-20 + dimension?.width}px;



  }
`;
};
const right = keyframes`

  0%   {right: -1%}
  25%  {right: 1%}
  50%  {right: -1%}
  75%  {right: 1%}
  100% {right: -1%}
`;
// When a component is coming to show, we use this to animate it's coming.
export const UpToDownAnimate = styled.div`
  transition: top 1s, background-color 1s, height 1s, z-index 1s, width 1s,
    margin-top 1s, visibility 1s, display 1s, opacity 0.5s;
  position: ${({ isVisible }) => (isVisible ? 'relative' : 'absolute')};
  width: ${({ isVisible, dimension }) => (isVisible ? '80%' : '381px')};
  justify-content: center;
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'flex')};
  min-height: ${({ isVisible }) => (isVisible ? '0rem' : '0rem')};
  z-index: ${({ isVisible }) => (isVisible ? 1 : -2)};

  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  animation-timing-function: ease-out;
  animation: ${({ isVisible, dimension }) =>
    isVisible
      ? css`
          ${up} 1s
        `
      : css`
          ${down(dimension)} 0.6s
        `};
`;
// For collapsing the text we use this.
export const CollapseAnimate = styled.div`
  position: relative;
  width: 80%;
  display: flex;
  justify-content: center;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  max-height: ${({ isVisible }) => (isVisible ? '15%' : '0')};
  min-height: ${({ isVisible }) => (isVisible ? '0%' : '0%')};
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  transition: max-height 1s, opacity 1s, min-height 1s;
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

export const IconVisibilityAnimate = styled.div`
  display: flex;

  background-color: ${({ isVisible }) => (isVisible ? 'red' : 'green')};
  transition: opacity 1s, background-color 1s;
`;

import styled, { css, keyframes } from 'styled-components';

const up = keyframes`
  from {
    top: -20%;
  }

  to {
   top:0%;
  }
`;
const down = keyframes`
  from {
    top: 0%;
  }

  to {
   top:20%;
  }
`;

export const UpToDownAnimate = styled.div`
  transition: top 1s, opacity 1s, background-color 1s;
  position: relative;
  width: 80%;
  display: flex;
  margin-top: 0.4rem;
  justify-content: center;
  padding-top: 0.8rem;
  top: ${({ isVisible }) => (isVisible ? `0%` : `20%`)};

  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  animation: ${({ isVisible }) =>
    isVisible
      ? css`
          ${up} 1s
        `
      : css`
          ${down} 1s
        `};
`;
export const CollapseAnimate = styled.div`
  position: relative;
  width: 80%;
  display: flex;
  justify-content: flex-start;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  max-height: ${({ isVisible }) => (isVisible ? '15%' : '0%')};
  min-height: ${({ isVisible }) => (isVisible ? '15%' : '0%')};
  transition: max-height 1s, opacity 1s, min-height 1s;
`;

import styled from 'styled-components';

export const ResizableConatiner = styled.div`
  ${({ size }) => (size?.width ? `width: ${size.width}px` : 'width: 200px')};
  ${({ size }) =>
    size?.height ? `height: ${size.height}px` : 'height: 200px'};
  min-width: ${({ minW }) => ` ${minW}px`};
  max-width: ${({ maxW }) => `${maxW}px`};
  min-height: ${({ minH }) => `${minH}px`};
  max-height: ${({ maxH }) => `${maxH}px`};
  padding: 10px;
  background-color: red;
  position: relative;
  overflow: hidden;
`;

const getResizerCss = ({ position }) => {
  switch (position) {
    case 'n':
      return `
            top: 0;
            right: 25%;
            cursor: ns-resize;
            height: 0.3rem;
            width: 50%;
        `;

    case 's':
      return `
            bottom: 0;
            right: 25%;
            cursor: ns-resize;
            height: 0.3rem;
            width: 50%;
        `;
    case 'e':
      return `
            right: 0;
            top: 25%;
            cursor: ew-resize;
            width: 0.3rem;
            height: 50%;
        `;

    default:
      return `
            left: 0;
            top: 25%;
            cursor: ew-resize;
            width: 0.3rem;
            height: 50%;
        `;
  }
};

export const Resizer = styled.div`
  position: absolute;
  ${getResizerCss}
  border-radius: 1rem;
  z-index: 1000;
  background-color: transparent;
  &: hover {
    background-color: black;
  }
  transition: all 0.5s ease;
`;

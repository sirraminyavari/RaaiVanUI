import styled from 'styled-components';

export const ResizableConatiner = styled.div`
  width: ${({ size }) => (size?.width ? `${size.width / 16}` : '12.5')}rem;
  height: ${({ size }) => (size?.height ? `${size.height / 16}` : '12.5')}rem;
  min-width: ${({ minW }) => ` ${minW / 16}`}rem;
  max-width: ${({ maxW }) => `${maxW / 16}`}rem;
  min-height: ${({ minH }) => `${minH / 16}`}rem;
  max-height: ${({ maxH }) => `${maxH / 16}`}rem;
  position: relative;
`;

const getResizerCss = ({ handle }) => {
  switch (handle) {
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

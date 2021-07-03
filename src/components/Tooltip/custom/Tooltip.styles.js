import styled from 'styled-components';

export const TooltipContainer = styled.div`
  display: inline-block;
  position: relative;
`;

const getPositionCss = ({ position, dimension }) => {
  switch (position) {
    case 'top':
      return `
      top: -${dimension.height}px;
      right: 50%;
      transform: translateX(50%) translateY(${dimension.offsetY}%);`;
    case 'left':
      return `
      right: ${dimension.width}px;
      top: 50%;
      transform: translateX(0) translateY(-50%);`;
    case 'right':
      return `
      left: ${dimension.width}px;
      top: 50%;
      transform: translateX(0) translateY(-50%);`;
    default:
      return `bottom: -${dimension.height}px; left: 50%; transform: translateX(-50%) translateY(${dimension.offsetY}%);`;
  }
};

export const Tooltip = styled.div`
  position: absolute;
  border-radius: 4px;
  padding: 6px;
  color: #fff;
  background: #333;
  z-index: ${({ zIndex }) => zIndex};
  white-space: nowrap;
  ${getPositionCss}
`;

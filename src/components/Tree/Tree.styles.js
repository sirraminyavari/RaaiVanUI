import styled from 'styled-components';

export const TreeContainer = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  alignitems: start;
  list-style: none;
  padding: 0;
`;

export const TreeNodeContainer = styled.li`
  padding: 0.5rem 1.5rem;
`;

export const LabelWrapper = styled.div`
  display: flex;
  justify-content: start;
`;

export const CaretWrapper = styled.div`
  display: flex;
  justify-content: start;
  ${({ isVisible }) => (isVisible ? 'transform: rotate(-45deg);' : '')}
`;

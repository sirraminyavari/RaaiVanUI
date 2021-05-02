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
  cursor: pointer;
`;

export const LabelWrapper = styled.div`
  display: flex;
  justify-content: start;
`;

export const IconWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  ${({ isVisible }) => (isVisible ? 'transform: rotate(-45deg);' : '')}
`;

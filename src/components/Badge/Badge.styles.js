import styled from 'styled-components';

export const BadgeWrapper = styled.div`
  height: 1.5rem;
  width: 1.5rem;
  line-height: 1.5rem;
  border-radius: 50%;
  background-color: ${({ color }) => (color ? color : 'inherit')};
  text-align: center;
  font-size: ${({ length }) => (length < 3 ? '60%' : '50%')};
  direction: rtl;
`;

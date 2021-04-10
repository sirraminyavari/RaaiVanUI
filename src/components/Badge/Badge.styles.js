import styled from 'styled-components';

export const BadgeWrapper = styled.div`
  height: ${({ withBorder }) => (!!withBorder ? '1.6rem' : '1.3rem')};
  padding: 0 0.3rem;
  line-height: 1.5rem;
  border-radius: 1rem;
  background-color: ${({ color }) => (color ? color : 'inherit')};
  ${({ withBorder }) => (!!withBorder ? 'border: 0.13rem solid #fff;' : '')}
  text-align: center;
  font-size: 0.9rem;
`;

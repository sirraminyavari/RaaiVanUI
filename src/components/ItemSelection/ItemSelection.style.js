import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  ${({ RV_RTL }) =>
    RV_RTL ? 'flex-direction:row' : 'flex-direction:row-reverse'}
`;
export const Maintainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Header = styled.div`
  display: flex;
  width: 100%;
  height: 3rem;
  flex-direction: row-reverse;
  justify-content: space-between;
  padding: 1rem;
`;

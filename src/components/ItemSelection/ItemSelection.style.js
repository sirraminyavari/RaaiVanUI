import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 99%;
  height: 90vh;
  ${({ RV_RTL }) =>
    RV_RTL ? 'flex-direction:row' : 'flex-direction:row-reverse'}
`;

import styled from 'styled-components';

export const MainContainer = styled.div`
  direction: ${window.RV_Direction};
`;

export const ContentWrapper = styled.div`
  ${window.RV_RTL ? 'margin-right' : 'margin-left'}: ${(props) =>
    props.isOpen ? '250px' : '55px'};
  height: 100vh;
  transition: all 0.7s ease;
`;

export const Content = styled.div`
  margin-top: 100px;
`;

import styled from 'styled-components';
import { OPEN_WIDTH, CLOSE_WIDTH } from 'constant/constants';

export const MainContainer = styled.div`
  direction: ${window.RV_Direction};
`;

export const ContentWrapper = styled.div`
  ${window.RV_RTL ? 'margin-right' : 'margin-left'}: ${({
    isSidebarOpen,
    isMobile,
  }) =>
    !isMobile
      ? isSidebarOpen
        ? `${OPEN_WIDTH}rem`
        : `${CLOSE_WIDTH}rem`
      : '0'};
  height: 100vh;
  transition: all 0.7s ease;
`;

export const Content = styled.div`
  margin-top: 100px;
`;

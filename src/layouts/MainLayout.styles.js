import styled from 'styled-components';
import { OPEN_WIDTH, CLOSE_WIDTH } from 'constant/constants';
import withTheme from 'components/withTheme/withTheme';

export const MainContainer = styled.div`
  direction: ${window.RV_Direction};
  .sidebar-resizer {
    &:hover {
      background-color: red;
    }
  }
`;

export const ContentWrapper = withTheme(styled.div`
  ${window.RV_RTL ? 'margin-right' : 'margin-left'}: ${(props) =>
    !props.isMobile
      ? props.isSidebarOpen
        ? `${props.theme.states.sidebarCurrentWidth / 16}rem`
        : `${CLOSE_WIDTH}rem`
      : '0'};
  height: 100vh;
  transition: all 0.7s ease;
`);

export const Content = styled.div`
  margin-top: 100px;
`;

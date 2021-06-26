import styled, { css } from 'styled-components';
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

const getContentMargin = (props) => {
  const {
    isMobile,
    isSidebarOpen,
    theme: { states },
  } = props;
  return css`${window.RV_RTL ? 'margin-right' : 'margin-left'}: ${
    !isMobile
      ? isSidebarOpen
        ? `${states.sidebarCurrentWidth / 16}rem`
        : `${states.selectedTeam?.id ? CLOSE_WIDTH : 0}rem`
      : '0'
  }};
  `;
};

export const ContentWrapper = withTheme(styled.div`
  ${getContentMargin}
  height: 100vh;
  transition: all 0.7s ease;
`);

export const Content = styled.div`
  margin-top: 5rem;
`;

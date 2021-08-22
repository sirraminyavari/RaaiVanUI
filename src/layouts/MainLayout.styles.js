import styled, { css } from 'styled-components';
import { CLOSE_WIDTH, TEAMS_PATH } from 'constant/constants';
import withTheme from 'components/withTheme/withTheme';

export const MainContainer = styled.div`
  direction: ${window.RV_Direction};
  .sidebar-resizer {
    &:hover {
      background-color: #fff;
    }
  }
`;

const getContentMargin = (props) => {
  const {
    isMobile,
    isSidebarOpen,
    theme: { states },
  } = props;
  if (states.activePath === TEAMS_PATH) return;
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
  height: calc(100vh - 5.5rem);
  transition: all 0.7s ease;
`);

export const Content = styled.div`
  margin-top: 5rem;
`;

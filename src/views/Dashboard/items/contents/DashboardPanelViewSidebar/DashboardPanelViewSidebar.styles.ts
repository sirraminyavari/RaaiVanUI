import styled from 'styled-components';
import {
  TCV_HIGHLY_TRANSPARENT,
  CV_DISTANT,
  TCV_DEFAULT,
  CV_WHITE,
  TCV_WARM,
} from 'constant/CssVariables';
import Badge from 'components/Badge/Badge';
import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';

export const DashboardPanelViewSidebarContainer = styled.div<{
  mobile?: boolean;
}>`
  padding-block: 1.625rem;
  padding-inline: 1.0625rem;
  background-color: ${CV_WHITE};
  background-image: linear-gradient(
    0deg,
    ${TCV_HIGHLY_TRANSPARENT},
    ${TCV_HIGHLY_TRANSPARENT}
  );
  user-select: none;
  position: sticky;
  top: 4rem;
  z-index: 100;
  ${({ mobile }) =>
    !mobile
      ? 'width: 18.75rem;'
      : `overflow-y:auto;
    border-bottom-left-radius: 0.8125rem;
    border-bottom-right-radius: 0.8125rem;
    `}

  transition: height 0.3s;
`;
DashboardPanelViewSidebarContainer.displayName =
  'DashboardPanelViewSidebarContainer';

export const DashboardPanelViewSidebarTitle = styled.h3<{
  mobile?: boolean;
  active?: boolean;
}>`
  color: ${CV_DISTANT};
  font-size: 1rem;
  font-weight: normal;
  margin-block-end: 1.5rem;
  display: flex;
  justify-content: space-between;
`;
DashboardPanelViewSidebarTitle.displayName = 'DashboardPanelViewSidebarTitle';

export const DashboardPanelViewSidebarMenuIcon = styled(ChevronIcon).attrs({
  dir: 'up',
  small: true,
})<{ active?: boolean }>`
  color: ${CV_DISTANT};
  font-size: 1rem;
  transition: transform 0.25 ease-in-out;
  ${({ active }) => active && `transform: rotate(-180deg);`}
`;
DashboardPanelViewSidebarMenuIcon.displayName =
  'DashboardPanelViewSidebarMenuIcon';

export const DashboardPanelViewSidebarItem = styled.div<{
  active?: boolean;
}>`
  width: 100%;
  height: 3rem;
  border-color: ${CV_DISTANT};
  border-style: solid;
  border-width: 0.03125rem;
  background-color: ${({ active }) => (active ? TCV_WARM : CV_WHITE)};
  border-radius: 0.4375rem;
  padding-block: 0.4375rem;
  padding-inline: 1rem;
  font-size: 1rem;
  margin-block-end: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  color: ${({ active }) => (active ? CV_WHITE : TCV_DEFAULT)};
  cursor: pointer;
`;
DashboardPanelViewSidebarItem.displayName = 'DashboardPanelViewSidebarItem';

export const DashboardPanelViewSidebarSeparator = styled.div<{
  active?: boolean;
}>`
  width: 100%;
  height: 0;
  border-color: ${CV_DISTANT};
  border-style: solid;
  border-width: 0.03125rem;
  margin-block-end: 1rem;
`;
DashboardPanelViewSidebarSeparator.displayName =
  'DashboardPanelViewSidebarSeparator';

export const DashboardPanelViewSidebarItemsContainer = styled.div<{
  mobile?: boolean;
  active?: boolean;
}>`
  max-height: calc(100vh - 14rem);
  overflow-y: auto;
  transition: height 0.3s ease-in-out;
  ${({ active, mobile }) => {
    if (mobile) return active ? `height: 0;` : `height: 30vh;`;
  }}
`;
DashboardPanelViewSidebarItemsContainer.displayName =
  'DashboardPanelViewSidebarItemsContainer';

export const DashboardPanelViewSidebarBadge = styled(Badge)<{
  active?: boolean;
}>`
  background-color: ${({ active }) => (active ? CV_WHITE : TCV_DEFAULT)};
  display: inline-flex;
  margin-inline: 0.5rem;
  color: ${({ active }) => (active ? TCV_DEFAULT : CV_WHITE)};
  font-size: 0.75rem;
`;
DashboardPanelViewSidebarBadge.displayName = 'DashboardPanelViewSidebarBadge';

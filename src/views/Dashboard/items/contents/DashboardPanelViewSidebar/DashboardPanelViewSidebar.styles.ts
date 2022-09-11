import styled from 'styled-components';
import {
  TCV_HIGHLY_TRANSPARENT,
  CV_DISTANT,
  TCV_DEFAULT,
  CV_WHITE,
  TCV_WARM,
} from 'constant/CssVariables';
import Badge from 'components/Badge/Badge';

export const DashboardPanelViewSidebarContainer = styled.div`
  width: 18.75rem;
  height: 100%;
  padding-block: 1.625rem;
  padding-inline: 1.0625rem;
  background-color: ${TCV_HIGHLY_TRANSPARENT};
`;
DashboardPanelViewSidebarContainer.displayName =
  'DashboardPanelViewSidebarContainer';

export const DashboardPanelViewSidebarTitle = styled.h3`
  height: 100%;
  color: ${CV_DISTANT};
  font-size: 1rem;
  font-weight: normal;
  margin-block-end: 1.5rem;
`;
DashboardPanelViewSidebarTitle.displayName = 'DashboardPanelViewSidebarTitle';

export const DashboardPanelViewSidebarItemContainer = styled.div<{
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
`;
DashboardPanelViewSidebarItemContainer.displayName =
  'DashboardPanelViewSidebarItemContainer';

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

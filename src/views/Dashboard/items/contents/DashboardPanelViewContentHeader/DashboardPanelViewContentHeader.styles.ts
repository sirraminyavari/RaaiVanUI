import styled from 'styled-components';
import { CV_GRAY } from 'constant/CssVariables';
import Heading from 'components/Heading/Heading';

export const DashboardPanelViewContentHeaderContainer = styled.div`
  position: relative;
  width: calc(100% - 18.75rem);
  height: 100%;
`;
DashboardPanelViewContentHeaderContainer.displayName =
  'DashboardPanelViewContentHeaderContainer';

export const DashboardPanelViewContentHeaderTitleContainer = styled.div`
  margin-block-start: 6.5rem;
  margin-block-end: 2.75rem;
  padding-inline: 1.875rem;
  display: flex;
  align-items: center;
`;
DashboardPanelViewContentHeaderTitleContainer.displayName =
  'DashboardPanelViewContentHeaderTitleContainer';

export const DashboardPanelViewContentHeaderTitleImage = styled.img`
  aspect-ratio: 1;
  width: 2rem;
  margin-inline-end: 1rem;
`;
DashboardPanelViewContentHeaderTitleImage.displayName =
  'DashboardPanelViewContentHeaderTitleImage';

export const DashboardPanelViewContentHeaderTitle = styled(Heading).attrs({
  type: 'H1',
})`
  font-size: 1.375rem;
  margin-inline-end: 2.75rem;
`;
DashboardPanelViewContentHeaderTitle.displayName =
  'DashboardPanelViewContentHeaderTitle';

export const DashboardPanelViewContentHeaderItemsCount = styled.span`
  font-size: 0.875rem;
  color: ${CV_GRAY};
`;
DashboardPanelViewContentHeaderItemsCount.displayName =
  'DashboardPanelViewContentHeaderItemsCount';

export const DashboardPanelViewContentHeaderSearchContainer = styled.div`
  padding-inline: 1.875rem;
  display: flex;
  align-items: center;
  margin-block-end: 1.5rem;
`;
DashboardPanelViewContentHeaderSearchContainer.displayName =
  'DashboardPanelViewContentHeaderSearchContainer';

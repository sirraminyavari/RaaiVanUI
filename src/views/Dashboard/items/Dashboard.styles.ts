import styled from 'styled-components';
// import { CV_DISTANT } from 'constant/CssVariables';

export const DashboardPanelViewContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 10rem);
`;
DashboardPanelViewContainer.displayName = 'DashboardPanelViewContainer';

export const DashboardPanelViewContent = styled.div`
  display: flex;
`;
DashboardPanelViewContent.displayName = 'DashboardPanelViewContent';

export const DashboardPanelViewContentBody = styled.div`
  display: flex;
  width: calc(100% - 18.75rem);
  height: 100%;
  flex-direction: column;
`;
DashboardPanelViewContentBody.displayName = 'DashboardPanelViewContentBody';

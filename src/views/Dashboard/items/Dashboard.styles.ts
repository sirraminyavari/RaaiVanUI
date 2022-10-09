import styled from 'styled-components';
// import { CV_DISTANT } from 'constant/CssVariables';

export const DashboardPanelViewContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 10rem);
`;
DashboardPanelViewContainer.displayName = 'DashboardPanelViewContainer';

export const DashboardPanelViewContent = styled.div<{ mobile?: boolean }>`
  display: flex;
  ${({ mobile }) => mobile && 'flex-direction: column;'}
`;
DashboardPanelViewContent.displayName = 'DashboardPanelViewContent';

export const DashboardPanelViewContentBody = styled.div<{ mobile?: boolean }>`
  display: flex;

  height: 100%;
  flex-direction: column;
  ${({ mobile }) => !mobile && 'width: calc(100% - 18.75rem);'}
`;
DashboardPanelViewContentBody.displayName = 'DashboardPanelViewContentBody';

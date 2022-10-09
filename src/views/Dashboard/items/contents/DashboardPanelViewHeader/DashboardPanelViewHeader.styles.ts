import styled from 'styled-components';
import { CV_RED, CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import ReturnButton from 'components/Buttons/ReturnButton';

export const DashboardPanelViewHeaderReturnButton = styled(ReturnButton)`
  padding-inline: 1.5rem;
  &:hover {
    border-color: ${CV_RED};
  }
`;
DashboardPanelViewHeaderReturnButton.displayName =
  'DashboardPanelViewHeaderReturnButton';

export const DashboardPanelViewHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-block: 1.125rem;
  padding-inline: 2rem;
  border-bottom: 0.05rem solid ${CV_DISTANT};
`;
DashboardPanelViewHeaderContainer.displayName =
  'DashboardPanelViewHeaderContainer';

export const DashboardPanelViewHeaderReturnButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
DashboardPanelViewHeaderReturnButtonContainer.displayName =
  'DashboardPanelViewHeaderReturnButtonContainer';

export const DashboardPanelViewHeaderTitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
DashboardPanelViewHeaderTitleContainer.displayName =
  'DashboardPanelViewHeaderTitleContainer';

export const DashboardPanelViewHeaderTitle = styled.h2`
  margin-inline-end: 3rem;
  color: ${TCV_DEFAULT};
  font-size: 1.125rem;
  display: flex;
`;
DashboardPanelViewHeaderTitle.displayName = 'DashboardPanelViewHeaderTitle';

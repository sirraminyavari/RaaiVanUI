import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY_DARK,
  CV_GRAY,
  CV_WHITE,
  TCV_DEFAULT,
  CV_1,
  CV_RED_SOFT,
  CV_RED,
  TCV_WARM,
  TCV_HIGHLY_TRANSPARENT,
} from 'constant/CssVariables';
import CheckIcon from 'components/Icons/CheckIcons/Check';
import StatusBadge from 'components/Badge/StatusBadge';
import CaretIcon from 'components/Icons/CaretIcons/Caret';

export const DashboardPanelViewToBeDoneItemsContainer = styled.div`
  padding-block: 1.125rem;
  padding-inline: 1.2rem;
`;
DashboardPanelViewToBeDoneItemsContainer.displayName =
  'DashboardPanelViewToBeDoneItemsContainer';

export const DashboardPanelViewToBeDoneItemContainer = styled.div`
  background-color: ${CV_WHITE};
  border: 0.0625rem solid ${CV_DISTANT};
  border-radius: 0.8125rem;
  padding-block: 1rem;
  padding-inline-start: 1rem;
  padding-inline-end: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
`;
DashboardPanelViewToBeDoneItemContainer.displayName =
  'DashboardPanelViewToBeDoneItemContainer';

export const DashboardPanelViewToBeDoneItemAcceptButton = styled(CheckIcon)<{
  checked?: boolean;
}>`
  font-size: 2.4rem;
  color: ${({ checked }) => (checked ? TCV_DEFAULT : 'transparent')};
  border-radius: 100%;
  border: 0.09375rem solid ${CV_DISTANT};
  padding: 0.2rem;
  cursor: pointer;
`;
DashboardPanelViewToBeDoneItemAcceptButton.displayName =
  'DashboardPanelViewToBeDoneItemAcceptButton';

export const DashboardPanelViewToBeDoneItemContentContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;
DashboardPanelViewToBeDoneItemContainer.displayName =
  'DashboardPanelViewToBeDoneItemContainer';

export const DashboardPanelViewToBeDoneItemTitleContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
`;
DashboardPanelViewToBeDoneItemTitleContainer.displayName =
  'DashboardPanelViewToBeDoneItemTitleContainer';

export const DashboardPanelViewToBeDoneItemTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${CV_GRAY_DARK};
  display: flex;
  gap: 1.5rem;
  align-items: center;
  padding-block: 0.5rem;
`;
DashboardPanelViewToBeDoneItemTitle.displayName =
  'DashboardPanelViewToBeDoneItemTitle';

export const DashboardPanelViewToBeDoneItemTitleID = styled.div`
  font-size: 0.875rem;
  font-weight: 400;
  color: ${CV_GRAY};
`;
DashboardPanelViewToBeDoneItemTitleID.displayName =
  'DashboardPanelViewToBeDoneItemTitleID';

export const DashboardPanelViewToBeDoneItemStatusBadgeContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;
DashboardPanelViewToBeDoneItemStatusBadgeContainer.displayName =
  'DashboardPanelViewToBeDoneItemStatusBadgeContainer';

export const DashboardPanelViewToBeDoneItemWorkFlowLabel = styled(StatusBadge)`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  color: ${TCV_WARM};
  background-color: ${TCV_HIGHLY_TRANSPARENT};
  font-size: 0.875rem;
  font-weight: 400;
  padding-inline: 1rem;
`;
DashboardPanelViewToBeDoneItemWorkFlowLabel.displayName =
  'DashboardPanelViewToBeDoneItemWorkFlowLabel';

export const DashboardPanelViewToBeDoneItemWorkFlowLabelIcon = styled(
  CaretIcon
).attrs({ dir: 'left' })`
  background-color: ${TCV_DEFAULT};
  color: ${CV_WHITE};
  font-size: 1rem;
  padding: 0.25rem;
  border-radius: 100%;
`;
DashboardPanelViewToBeDoneItemWorkFlowLabel.displayName =
  'DashboardPanelViewToBeDoneItemWorkFlowLabel';

export const DashboardPanelViewToBeDoneItemStatusBadge = styled(StatusBadge)<{
  type?: 'error' | 'default' | 'muted';
}>`
  font-size: 0.875rem;
  font-weight: 400;
  padding-inline: 0.9125rem;
  ${({ type }) => {
    switch (type) {
      case 'error':
        return `color: ${CV_RED};background-color:${CV_RED_SOFT};`;
      //@ts-expect-error
      case 'muted':
        return `color: ${CV_DISTANT};background-color:transparent;`;
      default:
        return `color: ${CV_GRAY};background-color:${CV_1}`;
    }
  }}
`;
DashboardPanelViewToBeDoneItemStatusBadge.displayName =
  'DashboardPanelViewToBeDoneItemStatusBadge';

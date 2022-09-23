import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_WHITE,
  TCV_DEFAULT,
  CV_FREEZED,
  CV_RED,
  TCV_WARM,
} from 'constant/CssVariables';
import Accordion from 'components/Accordion/Accordion';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import CheckIcon from 'components/Icons/CheckIcons/Check';
import Avatar from 'components/Avatar/Avatar';
import ExternalLinkIcon from 'components/Icons/ExternalLinkIcon/ExternalLinkIcon';

export const DashboardPanelViewRequestItemsContainer = styled.div`
  padding-block-start: 1.125rem;
  padding-inline: 1.2rem;

  &:last-of-type {
    padding-block-end: 1.125rem;
  }
`;
DashboardPanelViewRequestItemsContainer.displayName =
  'DashboardPanelViewRequestItemsContainer';

export const DashboardPanelViewRequestItemAccordion = styled(Accordion)`
  background-color: ${CV_WHITE};
  border: 0.0625rem solid ${CV_DISTANT};
  border-radius: 0.8125rem;
  opacity: 1;
  padding-block: 2rem;

  & > summary {
    font-size: 1.1rem;
    color: ${CV_GRAY};

    & > svg:first-of-type {
      font-size: 1.2rem;
      color: ${CV_GRAY};
      flex-shrink: 0;
    }
  }
  &[open] > summary {
    color: ${TCV_DEFAULT};
    & > svg:first-of-type {
      color: ${TCV_DEFAULT};
    }
  }
`;
DashboardPanelViewRequestItemAccordion.displayName =
  'DashboardPanelViewRequestItemAccordion';

export const DashboardPanelViewRequestItemLabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
`;
DashboardPanelViewRequestItemLabelContainer.displayName =
  'DashboardPanelViewRequestItemLabelContainer';

export const DashboardPanelViewRequestItemLabelRemainingText = styled.div`
  color: ${CV_DISTANT};
  font-size: 0.875rem;
  padding-inline-end: 2rem;
`;
DashboardPanelViewRequestItemLabelRemainingText.displayName =
  'DashboardPanelViewRequestItemLabelRemainingText';

export const DashboardPanelViewRequestItemDetailsContainer = styled.div`
  margin-inline: 0.6rem;
  margin-block: 0.6rem;
  border-inline-start-width: 0.1875rem;
  border-inline-start-style: solid;
  border-inline-start-color: ${CV_FREEZED};
`;
DashboardPanelViewRequestItemDetailsContainer.displayName =
  'DashboardPanelViewRequestItemDetailsContainer';

export const DashboardPanelViewRequestItemContainer = styled.div`
  margin-inline: 0.6rem;
  margin-block: 0.6rem;
  padding-inline: 1.15625rem;
  padding-block: 1.09375rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
DashboardPanelViewRequestItemContainer.displayName =
  'DashboardPanelViewRequestItemContainer';

export const DashboardPanelViewRequestItemActionsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 0.5rem;
`;
DashboardPanelViewRequestItemActionsContainer.displayName =
  'DashboardPanelViewRequestItemActionsContainer';

export const DashboardPanelViewRequestItemRejectButton = styled(CloseIcon)`
  font-size: 2rem;
  color: ${CV_RED};
  border-radius: 100%;
  border: 0.09375rem solid ${CV_DISTANT};
  padding: 0.4rem;
  cursor: pointer;
`;
DashboardPanelViewRequestItemRejectButton.displayName =
  'DashboardPanelViewRequestItemRejectButton';

export const DashboardPanelViewRequestItemExternalLinkIcon = styled(
  ExternalLinkIcon
)`
  font-size: 0.9rem;
  margin-inline: 0.4rem;
  color: ${CV_DISTANT};
  cursor: pointer;

  &:hover {
    color: ${TCV_DEFAULT};
  }
`;
DashboardPanelViewRequestItemExternalLinkIcon.displayName =
  'DashboardPanelViewRequestItemExternalLinkIcon';

export const DashboardPanelViewRequestItemAcceptButton = styled(
  CheckIcon
).attrs({ bold: true })`
  font-size: 2.4rem;
  color: ${TCV_DEFAULT};
  border-radius: 100%;
  border: 0.09375rem solid ${CV_DISTANT};
  padding: 0.2rem;
  cursor: pointer;
`;
DashboardPanelViewRequestItemAcceptButton.displayName =
  'DashboardPanelViewRequestItemAcceptButton';

export const DashboardPanelViewRequestItemUserContainer = styled.span`
  margin-inline-start: 2rem;
  margin-inline-end: 0rem;
  padding-block: 0.6rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  width: 100%;
  border-block-end-color: ${CV_FREEZED};
  border-block-end-style: solid;
  border-block-end-width: 0.0625rem;
`;
DashboardPanelViewRequestItemUserContainer.displayName =
  'DashboardPanelViewRequestItemUserContainer';

export const DashboardPanelViewRequestItemUserAvatar = styled(Avatar)`
  width: 2rem;
  height: 2rem;
  aspect-ratio: 1;
  border-radius: 100%;
`;
DashboardPanelViewRequestItemUserAvatar.displayName =
  'DashboardPanelViewRequestItemUserAvatar';

export const DashboardPanelViewRequestItemUserName = styled.span`
  font-size: 1rem;
  color: ${TCV_WARM};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
`;
DashboardPanelViewRequestItemUserName.displayName =
  'DashboardPanelViewRequestItemUserName';

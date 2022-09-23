import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_WHITE,
  TCV_DEFAULT,
  CV_FREEZED,
} from 'constant/CssVariables';
import Accordion from 'components/Accordion/Accordion';
import ExternalLinkIcon from 'components/Icons/ExternalLinkIcon/ExternalLinkIcon';

export const DashboardPanelViewDoneItemsContainer = styled.div`
  padding-block-start: 1.125rem;
  padding-inline: 1.2rem;

  &:last-of-type {
    padding-block-end: 1.125rem;
  }
`;
DashboardPanelViewDoneItemsContainer.displayName =
  'DashboardPanelViewDoneItemsContainer';

export const DashboardPanelViewDoneItemAccordion = styled(Accordion)`
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
DashboardPanelViewDoneItemAccordion.displayName =
  'DashboardPanelViewDoneItemAccordion';

export const DashboardPanelViewDoneItemLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
`;
DashboardPanelViewDoneItemLabel.displayName = 'DashboardPanelViewDoneItemLabel';

export const DashboardPanelViewDoneItemDetailsContainer = styled.div`
  margin-inline: 0.6rem;
  margin-block: 0.6rem;
  border-inline-start-width: 0.1875rem;
  border-inline-start-style: solid;
  border-inline-start-color: ${CV_FREEZED};
`;
DashboardPanelViewDoneItemDetailsContainer.displayName =
  'DashboardPanelViewDoneItemDetailsContainer';

export const DashboardPanelViewDoneItemContainer = styled.div`
  margin-inline: 0.6rem;
  margin-block: 0.6rem;
  padding-inline: 1.15625rem;
  padding-block: 1.09375rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;
DashboardPanelViewDoneItemContainer.displayName =
  'DashboardPanelViewDoneItemContainer';

export const DashboardPanelViewDoneItemTitle = styled.span`
  font-size: 1rem;
`;
DashboardPanelViewDoneItemTitle.displayName = 'DashboardPanelViewDoneItemTitle';

export const DashboardPanelViewDoneItemExternalLinkIcon = styled(
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
DashboardPanelViewDoneItemExternalLinkIcon.displayName =
  'DashboardPanelViewDoneItemExternalLinkIcon';

export const DashboardPanelViewDoneItemSeparator = styled.div`
  margin-inline: 1.34375rem;
  height: 0.0625rem;
  width: calc(100% - 2.6875rem);
  background-color: ${CV_FREEZED};
`;
DashboardPanelViewDoneItemSeparator.displayName =
  'DashboardPanelViewDoneItemSeparator';
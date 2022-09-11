import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_GRAY_LIGHT,
  CV_GRAY_DARK,
  CV_WHITE,
  TCV_WARM,
  CV_RED,
  CV_1,
  CV_2,
  CV_3,
} from 'constant/CssVariables';
import { BO_RADIUS_HALF } from 'constant/constants';
import InfoCircleIcon from 'components/Icons/InfoCircleIcon/InfoIcon';
import Badge from 'components/Badge/Badge';

export const DashboardCardsBlockContainer = styled.div`
  margin-block-end: 0.5rem;
  display: block;
`;
DashboardCardsBlockContainer.displayName = 'DashboardCardsBlockContainer';

export const DashboardCardsItemBlockTitle = styled.span`
  font-size: 0.88rem;
  color: ${CV_DISTANT};
  display: block;
  padding-inline-start: 1.1rem;
`;
DashboardCardsItemBlockTitle.displayName = 'DashboardCardsItemBlockTitle';

export const DashboardCardItemImage = styled.img`
  display: inline-flex;
  aspect-ratio: 1;
  width: 2rem;
  margin-inline-end: 0.5rem;
`;
DashboardCardItemImage.displayName = 'DashboardCardItemImage';

export const DashboardCardsItemBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
DashboardCardsItemBlock.displayName = 'DashboardCardsItemBlock';

export const DashboardCardsItemNotAvailable = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 30vh;
  color: ${CV_DISTANT};
  font-size: 1rem;
`;
DashboardCardsItemBlock.displayName = 'DashboardCardsItemBlock';

export const DashboardCardItem = styled.div`
  background-color: ${CV_GRAY_LIGHT};
  border-color: ${CV_1};
  border-style: solid;
  border-width: 1px;
  border-radius: 0.8125rem;
  padding-inline: 1.25rem;
  padding-block: 1rem;
  margin-block: 1rem;
  margin-inline: 1rem;
  display: inline-flex;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: 27.5rem;
  min-width: 20rem;
  display: flex;
  flex-direction: column;
`;
DashboardCardItem.displayName = 'DashboardCardItem';

export const DashboardCardItemTitle = styled.span<{ forTemplates?: boolean }>`
  font-size: 1.125rem;
  color: ${({ forTemplates }) => (forTemplates ? TCV_WARM : CV_GRAY_DARK)};
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-block-end: 1rem;
  padding-inline-start: 0.6rem;
`;
DashboardCardItemTitle.displayName = 'DashboardCardItemTitle';

export const DashboardCardItemTitleInfoIcon = styled(InfoCircleIcon)`
  font-size: 1.3rem;
  color: ${CV_DISTANT};
  margin-inline-start: 0.7rem;
`;
DashboardCardItemTitleInfoIcon.displayName = 'DashboardCardItemTitleInfoIcon';

export const DashboardCardItemLabelText = styled.div.attrs({
  className: BO_RADIUS_HALF,
})`
  font-size: 1rem;
  font-weight: medium;
  padding-inline-start: 0.85rem;
  color: ${CV_GRAY_DARK};
  letter-spacing: 0;
  transition: padding 0.2s ease-out;
`;
DashboardCardItemLabelText.displayName = 'DashboardCardItemLabelText';

export const DashboardCardItemLabelContainer = styled.div<{
  isDone?: boolean;
}>`
  background-color: ${CV_WHITE};
  padding-block: 0.8rem;
  padding-inline: 0.85rem;
  position: relative;
  border-radius: 0.45rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &:not(:last-of-type) {
    margin-block-end: 0.5rem;
  }
  &:after {
    content: '';
    position: absolute;
    height: 70%;
    width: 0.3rem;
    background-color: ${({ isDone }) => (isDone ? CV_3 : CV_2)};
    inset-block-start: 15%;
    inset-inline-start: 0.7rem;
    border-radius: 0.85rem;
    transition: inset 0.2s ease-out;
  }

  &:hover {
    &:after {
      inset-inline-start: 1.2rem;
    }

    ${DashboardCardItemLabelText} {
      padding-inline-start: 1.4rem;
    }
  }
`;
DashboardCardItemLabelContainer.displayName = 'DashboardCardItemLabelContainer';

export const DashboardCardItemLabelTextBadge = styled(Badge)`
  background-color: ${CV_RED};
  display: inline-flex;
  margin-inline: 0.5rem;
  color: ${CV_WHITE};
  font-size: 0.875rem;
`;
DashboardCardItemLabelTextBadge.displayName = 'DashboardCardItemLabelTextBadge';

export const DashboardCardItemLabelNumber = styled.span`
  font-size: 1rem;
  font-weight: normal;
  padding-inline-end: 0.45rem;
  color: ${CV_GRAY};
`;
DashboardCardItemLabelNumber.displayName = 'DashboardCardItemLabelNumber';

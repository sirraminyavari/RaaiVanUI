import {
  TCV_WARM,
  CV_GRAY,
  TCV_HIGHLY_TRANSPARENT,
} from 'constant/CssVariables';
import EmptyCalendarIcon from 'components/Icons/CalendarIcon/EmptyCalendarIcon';
import styled from 'styled-components';

export const DashboardPanelDateContainer = styled.div<{ minimal?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ minimal }) => !minimal && `background-color: ${TCV_HIGHLY_TRANSPARENT};`}
  ${({ minimal }) => `color: ${minimal ? CV_GRAY : TCV_WARM};`}
  border-radius: 0.8125rem;
  gap: 1rem;
  padding-block: 0.3125rem;
  padding-inline: 0.7rem;
  font-size: 0.875rem;
`;
DashboardPanelDateContainer.displayName = 'DashboardPanelDateContainer';

export const DashboardPanelDateCalendarIcon = styled(EmptyCalendarIcon)`
  font-size: 1.3rem;
`;
DashboardPanelDateContainer.displayName = 'DashboardPanelDateContainer';

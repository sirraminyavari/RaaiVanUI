import { CV_WHITE, TCV_DEFAULT, CV_1 } from 'constant/CssVariables';
import styled from 'styled-components';

export const DashboardSettingFieldsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;
DashboardSettingFieldsContainer.displayName = 'DashboardSettingFieldsContainer';

export const DashboardSettingFieldItem = styled.div`
  background-color: ${CV_WHITE};
  border-radius: 0.8125rem;
  padding-block: 0.475rem;
  padding-inline: 0.45rem;
  min-width: 17rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
DashboardSettingFieldItem.displayName = 'DashboardSettingFieldItem';

export const DashboardSettingFieldItemTriggerButton = styled.div.attrs({
  children: '...',
})`
  background-color: ${CV_1};
  border-radius: 1.1rem;
  padding-block: 0.845rem;
  padding-inline: 0.445rem;
  min-width: 2.8rem;
  flex-grow: 0;
  flex-shrink: 0;
  text-align: center;
  line-height: 0rem;
  cursor: pointer;
  color: ${TCV_DEFAULT};
`;
DashboardSettingFieldItemTriggerButton.displayName =
  'DashboardSettingFieldItemTriggerButton';

export const DashboardSettingFieldItemTitle = styled.span`
  color: ${TCV_DEFAULT};
  font-size: 1rem;
  margin-inline-start: 1.5rem;
`;
DashboardSettingFieldItemTitle.displayName = 'DashboardSettingFieldItemTitle';

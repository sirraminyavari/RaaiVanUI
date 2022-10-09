import styled, { keyframes, css } from 'styled-components';
import { CV_RED, CV_GRAY, CV_GRAY_LIGHT } from 'constant/CssVariables';
import ReturnButton from 'components/Buttons/ReturnButton';
import Heading from 'components/Heading/Heading';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import RefreshIcon from 'components/Icons/RefreshIcon/RefreshIcon';
import ShadowButton from 'components/Buttons/ShadowButton';

export const DashboardHeaderReturnButton = styled(ReturnButton)`
  padding-inline: 1.5rem;
  &:hover {
    border-color: ${CV_RED};
  }
`;
DashboardHeaderReturnButton.displayName = 'DashboardHeaderReturnButton';

export const DashboardHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-block-start: 0.5rem;
`;
DashboardHeaderContainer.displayName = 'DashboardHeaderContainer';

export const DashboardHeaderReturnButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`;
DashboardHeaderReturnButtonContainer.displayName =
  'DashboardHeaderReturnButtonContainer';

export const DashboardHeaderTitleContainer = styled.div`
  width: 100%;
  display: flex;
  padding-block-start: 1.7rem;
  margin-block-end: 2.5rem;
  align-items: center;
`;
DashboardHeaderTitleContainer.displayName = 'DashboardHeaderTitleContainer';

export const DashboardHeaderSettingTitle = styled.div`
  width: 100%;
  color: ${CV_GRAY};
  font-size: 1rem;
  margin-block-end: 1rem;
  letter-spacing: -0.02rem;
`;
DashboardHeaderSettingTitle.displayName = 'DashboardHeaderSettingTitle';

export const DashboardHeaderTitle = styled(Heading).attrs({ type: 'H1' })`
  margin-inline-end: 3rem;
`;
DashboardHeaderTitle.displayName = 'DashboardHeaderTitle';

export const DashboardHeaderShadowButton = styled(ShadowButton)`
  width: 3rem;
  height: 3rem;
  &:not(:last-of-type) {
    margin-inline-end: 1rem;
  }
`;
DashboardHeaderShadowButton.displayName = 'DashboardHeaderShadowButton';

export const DashboardHeaderSettingIcon = styled(SettingIcon)`
  font-size: 1.4rem;
`;
DashboardHeaderSettingIcon.displayName = 'DashboardHeaderSettingIcon';

const rotateKeyFrame = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;
const rotateAnimation = css`
  animation: ${rotateKeyFrame} 1s infinite;
`;
export const DashboardHeaderRefreshIcon = styled(RefreshIcon)<{
  isLoading?: boolean;
}>`
  font-size: 2rem;
  ${({ isLoading }) => isLoading && rotateAnimation};
`;
DashboardHeaderRefreshIcon.displayName = 'DashboardHeaderRefreshIcon';

export const DashboardHeaderFunctionsContainer = styled.div`
  width: 100%;
  display: flex;
  padding-block: 1.7rem;
`;
DashboardHeaderFunctionsContainer.displayName =
  'DashboardHeaderFunctionsContainer';

export const DashboardHeaderSettingContainer = styled.div`
  width: 100%;
  padding-block: 1.5rem;
  margin-block: 2rem;
  padding-inline: 1.5rem;
  background-color: ${CV_GRAY_LIGHT};
  border-radius: 0.8125rem;
`;
DashboardHeaderSettingContainer.displayName = 'DashboardHeaderSettingContainer';

import styled from 'styled-components';
import {
  OnboardingPageDescriptionText,
  OnboardingPageTitleText,
} from 'views/Onboarding/items/Onboarding.styles';
import OnboardingBannerBackgroundImage from 'assets/images/onboarding-banner-background.svg?file';
import { TCV_DEFAULT, CV_WHITE } from 'constant/CssVariables';
import Button from 'components/Buttons/Button';
import PanelButton from 'components/Buttons/PanelButton';

export const OnboardingTeamTitleWrapper = OnboardingPageTitleText;
export const OnboardingTeamDescriptionWrapper = OnboardingPageDescriptionText;

export const OnboardingTeamButton = styled(Button)`
  padding-inline: 3rem;
  min-height: 3rem;
`;
OnboardingTeamButton.displayName = 'OnboardingTeamButton';

export const OnboardingTeamHugePanelButton = styled(PanelButton)`
  width: 16rem;
  font-size: 1.13rem;

  & > span:first-letter {
    text-transform: uppercase;
  }
  & > svg {
    font-size: 5.63rem;
  }
`;
OnboardingTeamHugePanelButton.displayName = 'OnboardingTeamHugePanelButton';

export const OnboardingTeamFlatPanelButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`;
OnboardingTeamFlatPanelButtonGroup.displayName =
  'OnboardingTeamFlatPanelButtonGroup';

export const OnboardingTeamImageBannerWrapper = styled.div<{
  noBackgroundImage?: boolean;
  BackgroundImage?: string;
  isMobile?: boolean;
}>`
  min-height: 100%;
  > div {
    min-height: 100%;
    width: ${({ isMobile }) => (isMobile ? '80%' : '100%')};
    max-width: 30rem;
    margin-inline: auto;
    aspect-ratio: 1;
    justify-content: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    ${({ noBackgroundImage, BackgroundImage }) =>
      !noBackgroundImage &&
      `
    background-image: url(${
      BackgroundImage ? BackgroundImage : OnboardingBannerBackgroundImage
    });
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    transition:background-image 0.3s;
    `}
  }
`;
OnboardingTeamImageBannerWrapper.displayName =
  'OnboardingTeamImageBannerWrapper';

export const OnboardingTeamImageBanner = styled.img`
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

OnboardingTeamImageBanner.displayName = 'OnboardingTeamImageBanner';

export const OnboardingTeamInputWrapper = styled.div<{ isMobile?: boolean }>`
  margin-block-start: ${({ isMobile }) => (isMobile ? '2rem' : '8rem')};
  margin-inline-start: 1rem;
  margin-inline-end: 1rem;
  max-width: ${({ isMobile }) => (isMobile ? '85%' : '30vw')};
  width: 100%;
  display: flex;
`;

OnboardingTeamInputWrapper.displayName = 'OnboardingTeamInputWrapper';

export const OnboardingTeamButtonInputWrapper = styled.div<{
  wrap?: boolean;
  isMobile?: boolean;
}>`
  margin-block-start: 1rem;
  margin-inline-end: 1rem;
  justify-content: center;
  width: 100%;
  max-width: 45rem;
  display: flex;
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'nowrap')};
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  align-items: ${({ isMobile }) => (isMobile ? 'center' : 'start')};
`;

OnboardingTeamButtonInputWrapper.displayName =
  'OnboardingTeamButtonInputWrapper';

export const OnboardingTeamContentContainer = styled.div`
  min-height: 50vh;
  position: relative;
`;

OnboardingTeamContentContainer.displayName = 'OnboardingTeamContentContainer';

export const OnboardingTeamAvatarPlaceholder = styled.div<{
  backgroundImageURL?: string;
}>`
  color: ${TCV_DEFAULT};
  font-size: 0.8rem;
  width: 50%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  ${({ backgroundImageURL }) =>
    backgroundImageURL && `background-image:url("${backgroundImageURL}")`}
`;

OnboardingTeamAvatarPlaceholder.displayName = 'OnboardingTeamAvatarPlaceholder';

export const OnboardingTeamTitleDescription = styled(
  OnboardingPageDescriptionText
)`
  padding-inline: 0;
  text-align: start;
  margin-block: 0.8rem;
`;

OnboardingTeamTitleDescription.displayName = 'OnboardingTeamTitleDescription';

export const OnboardingTeamActionButtonWrapper = styled.div`
  margin-block-start: 2.2rem;
  padding-block: 1rem;
  width: 100%;
  margin-inline: auto;
  display: flex;
  // flex-wrap: wrap;
  flex-shrink: 0;

  & > * {
    margin-inline: 3rem;
  }
`;
OnboardingTeamActionButtonWrapper.displayName =
  'OnboardingTeamActionButtonWrapper';

export const OnboardingTeamSetWorkFieldInputWrapper = styled.div<{
  hide?: boolean;
}>`
  margin-block-start: 2.2rem;
  padding-inline: 1rem;
  width: 100%;
  margin-inline: auto;
  ${({ hide }) => hide && 'opacity: 0;'}
`;
OnboardingTeamActionButtonWrapper.displayName =
  'OnboardingTeamActionButtonWrapper';

export const OnboardingTeamWelcomeLayoutWrapper = styled.div<{
  noFixedHeight?: boolean;
}>`
  ${({ noFixedHeight }) => !noFixedHeight && `height: calc(100vh - 12rem);`}
  width: 100%;
  overflow: auto;
  background-color: ${CV_WHITE};
`;
OnboardingTeamWelcomeLayoutWrapper.displayName =
  'OnboardingTeamWelcomeLayoutWrapper';

export const OnboardingPanelButtonLabel = styled.span`
  &:first-letter {
    text-transform: uppercase;
  }
`;
OnboardingPanelButtonLabel.displayName = 'OnboardingPanelButtonLabel';

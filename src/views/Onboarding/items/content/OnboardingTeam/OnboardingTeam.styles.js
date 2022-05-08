import styled from 'styled-components';
import {
  OnboardingPageDescriptionText,
  OnboardingPageTitleText,
} from 'views/Onboarding/items/Onboarding.styles';
import OnboardingBannerBackgroundImage from 'assets/images/onboarding-banner-background.svg?file';
import { TCV_DEFAULT, CV_WHITE } from 'constant/CssVariables';

export const OnboardingTeamTitleWrapper = OnboardingPageTitleText;
export const OnboardingTeamDescriptionWrapper = OnboardingPageDescriptionText;

export const OnboardingTeamFlatPanelButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`;
OnboardingTeamFlatPanelButtonGroup.displayName =
  'OnboardingTeamFlatPanelButtonGroup';

export const OnboardingTeamImageBannerWrapper = styled.div`
  min-height: 100%;
  > div {
    min-height: 100%;
    width: 100%;
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

export const OnboardingTeamInputWrapper = styled.div`
  margin-block-start: 10rem;
  margin-inline-end: 1rem;
  max-width: 25rem;
  width: 100%;
  display: flex;
`;

OnboardingTeamInputWrapper.displayName = 'OnboardingTeamInputWrapper';

export const OnboardingTeamButtonInputWrapper = styled.div`
  margin-block-start: 5rem;
  margin-inline-end: 1rem;
  justify-content: center;
  width: 100%;
  display: flex;
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'nowrap')};
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  align-items: ${({ isMobile }) => (isMobile ? 'center' : 'start')};
`;

OnboardingTeamButtonInputWrapper.displayName =
  'OnboardingTeamButtonInputWrapper';

export const OnboardingTeamAvatarPlaceholder = styled.div`
  color: ${TCV_DEFAULT};
  font-size: 0.8rem;
`;

OnboardingTeamAvatarPlaceholder.displayName = 'OnboardingTeamAvatarPlaceholder';

export const OnboardingTeamActionButtonWrapper = styled.div`
  margin-block-start: 2.2rem;
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

export const OnboardingTeamSetWorkFieldInputWrapper = styled.div`
  margin-block-start: 2.2rem;
  padding-inline: 1rem;
  width: 100%;
  margin-inline: auto;
`;
OnboardingTeamActionButtonWrapper.displayName =
  'OnboardingTeamActionButtonWrapper';

export const OnboardingTeamWelcomeLayoutWrapper = styled.div`
  ${({ noFixedHeight }) => !noFixedHeight && `height: calc(100vh - 12rem);`}
  width: 100%;
  overflow: auto;
  background-color: ${CV_WHITE};
`;
OnboardingTeamWelcomeLayoutWrapper.displayName =
  'OnboardingTeamWelcomeLayoutWrapper';

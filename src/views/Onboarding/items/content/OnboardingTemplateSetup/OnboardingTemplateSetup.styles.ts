import styled from 'styled-components';
import Heading from 'components/Heading/Heading';
import {
  OnboardingCenterizeContent,
  OnboardingPageTitleText,
} from 'views/Onboarding/items/Onboarding.styles';
import { CV_GRAY } from 'constant/CssVariables';
import CelebrateAnimation from 'components/celebrateAnimation/celebrateAnimation';

export const OnboardingTemplateSetupWrapper = styled(
  OnboardingCenterizeContent
)`
  margin-block-start: 5vh;
  position: relative;
`;
OnboardingTemplateSetupWrapper.displayName = 'OnboardingTemplateSetupWrapper';

export const OnboardingTemplateSetupTitle = styled(OnboardingPageTitleText)`
  max-width: 60rem;
  text-align: center;
  margin-block-start: 2rem;
  margin-block-end: 4rem;

  &::first-letter {
    text-transform: capitalize;
  }
`;
OnboardingTemplateSetupTitle.displayName = 'OnboardingTemplateSetupTitle';

export const OnboardingTemplateSetupDescriptionWrapper = styled.div`
  margin-block-start: 20vh;
`;
OnboardingTemplateSetupDescriptionWrapper.displayName =
  'OnboardingTemplateSetupDescriptionWrapper';

export const OnboardingTemplateSetupTitleDescription = styled(Heading).attrs({
  type: 'h5',
})<{ mediumFontWeight?: boolean }>`
  color: ${CV_GRAY};

  font-weight: ${({ mediumFontWeight }) =>
    mediumFontWeight ? '500' : '400'} !important;
  margin-block: 1rem;

  &::first-letter {
    text-transform: capitalize;
  }

  & > svg {
    display: inline-block;
    margin-block-end: -0.3rem;
    margin-inline-end: 0.5rem;
  }
`;
OnboardingTemplateSetupTitle.displayName = 'OnboardingTemplateSetupTitle';

export const OnboardingTemplateSetupVideoContainer = styled.div`
  max-width: 50rem;
  width: 100%;
`;
OnboardingTemplateSetupVideoContainer.displayName =
  'OnboardingTemplateSetupVideoContainer';

export const OnboardingTemplateSetupCelebrateAnimation = styled(
  CelebrateAnimation
).attrs({ width: '100%', height: '100%' })`
  position: absolute;
  inset-inline: 0;
  z-index: -1;
  inset-block-start: 0;
`;
OnboardingTemplateSetupCelebrateAnimation.displayName =
  'OnboardingTemplateSetupCelebrateAnimation';

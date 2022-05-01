import styled from 'styled-components';
import Heading from 'components/Heading/Heading';
import { OnboardingCenterizeContent } from 'views/Onboarding/items/Onboarding.styles';
import { CV_GRAY_DARK, CV_GRAY } from 'constant/CssVariables';

export const OnboardingTemplateSetupWrapper = styled(
  OnboardingCenterizeContent
)`
  padding-block-start: 25vh;
`;
OnboardingTemplateSetupWrapper.displayName = 'OnboardingTemplateSetupWrapper';

export const OnboardingTemplateSetupTitle = styled(Heading).attrs({
  type: 'H1',
})`
  color: ${CV_GRAY_DARK};
  max-width: 60rem;
  text-align: center;
  margin-block-start: 2rem;
  margin-block-end: 4rem;

  &::first-letter {
    text-transform: capitalize;
  }
`;
OnboardingTemplateSetupTitle.displayName = 'OnboardingTemplateSetupTitle';

export const RVDicOnboardingTemplateSetupDescription = styled(Heading).attrs({
  type: 'H6',
})`
  color: ${CV_GRAY};
  max-width: 60rem;
  text-align: center;
  margin-block-end: 2.5rem;
`;
RVDicOnboardingTemplateSetupDescription.displayName =
  'RVDicOnboardingTemplateSetupDescription';

export const OnboardingTemplateSetupVideoContainer = styled.div`
  max-width: 50rem;
  width: 100%;
`;
OnboardingTemplateSetupVideoContainer.displayName =
  'OnboardingTemplateSetupVideoContainer';

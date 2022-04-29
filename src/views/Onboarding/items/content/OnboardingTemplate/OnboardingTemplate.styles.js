import styled, { keyframes } from 'styled-components';
import Heading from 'components/Heading/Heading';
import { OnboardingCenterizeContent } from 'views/Onboarding/items/Onboarding.styles';
import { CV_GRAY_DARK, CV_GRAY } from 'constant/CssVariables';

export const OnboardingTemplateWrapper = styled(OnboardingCenterizeContent)`
  padding-block-end: 2rem;
`;
OnboardingTemplateWrapper.displayName = 'OnboardingTemplateWrapper';

export const OnboardingTemplateTitle = styled(Heading).attrs({ type: 'H1' })`
  color: ${CV_GRAY_DARK};
  max-width: 60rem;
  text-align: center;
  margin-block: 2.5rem;
`;
OnboardingTemplateTitle.displayName = 'OnboardingTemplateTitle';

export const RVDicOnboardingTemplateDescription = styled(Heading).attrs({
  type: 'H6',
})`
  color: ${CV_GRAY};
  max-width: 60rem;
  text-align: center;
  margin-block-end: 2.5rem;
`;
RVDicOnboardingTemplateDescription.displayName =
  'RVDicOnboardingTemplateDescription';

export const OnboardingTemplateVideoContainer = styled.div`
  max-width: 50rem;
  width: 100%;
`;
OnboardingTemplateVideoContainer.displayName =
  'OnboardingTemplateVideoContainer';

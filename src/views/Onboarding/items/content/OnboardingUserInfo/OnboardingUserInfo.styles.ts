import styled from 'styled-components';
import { OnboardingPageDescriptionText } from 'views/Onboarding/items/Onboarding.styles';

export const OnboardingUserInfoDescriptionWrapper =
  OnboardingPageDescriptionText;

export const OnboardingUserInfoInputContainer = styled.div`
  max-width: 30rem;
  width: 100%;
  opacity: 1 !important;
`;
OnboardingUserInfoInputContainer.displayName =
  'OnboardingUserInfoInputContainer';

export const OnboardingUserInfoInputWrapper = styled.div`
  margin-block: 1rem;
  font-size: 1.175rem;
`;
OnboardingUserInfoInputWrapper.displayName = 'OnboardingUserInfoInputWrapper';

export const OnboardingUserInfoActionButtonWrapper = styled.div`
  margin-block-start: 2.2rem;
  max-width: 50%;
  margin-inline: auto;
`;
OnboardingUserInfoActionButtonWrapper.displayName =
  'OnboardingUserInfoActionButtonWrapper';

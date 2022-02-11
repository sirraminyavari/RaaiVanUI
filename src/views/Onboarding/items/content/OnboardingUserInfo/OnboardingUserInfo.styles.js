import styled from 'styled-components';

export const OnboardingUserInfoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: calc(100vh - 20rem);
  width: 100%;
  & > * {
    flex-shrink: 0;
  }
`;
OnboardingUserInfoWrapper.displayName = 'OnboardingUserInfoWrapper';

export const OnboardingUserInfoInputContainer = styled.div`
  max-width: 30rem;
  width: 100%;
  opacity: 1 !important;
`;
OnboardingUserInfoInputContainer.displayName =
  'OnboardingUserInfoInputContainer';

export const OnboardingUserInfoInputWrapper = styled.div`
  margin-block: 1rem;
`;
OnboardingUserInfoInputWrapper.displayName = 'OnboardingUserInfoInputWrapper';

export const OnboardingUserInfoActionButtonWrapper = styled.div`
  margin-block-start: 2.2rem;
  max-width: 50%;
  margin-inline: auto;
`;
OnboardingUserInfoActionButtonWrapper.displayName =
  'OnboardingUserInfoActionButtonWrapper';

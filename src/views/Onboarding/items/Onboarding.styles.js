import styled, { keyframes } from 'styled-components';
import { CV_GRAY, CV_WHITE } from 'constant/CssVariables';

const waveAnimationKeyframes = keyframes`

    0% { transform: rotate( 0.0deg) }
   10% { transform: rotate(14.0deg) } 
   20% { transform: rotate(-8.0deg) }
   30% { transform: rotate(14.0deg) }
   40% { transform: rotate(-4.0deg) }
   50% { transform: rotate(10.0deg) }
   60% { transform: rotate( 0.0deg) } 
  100% { transform: rotate( 0.0deg) }
`;

export const WaveContent = styled.span`
  animation-name: ${waveAnimationKeyframes};
  animation-duration: 1.8s;
  animation-iteration-count: 1;
  animation-delay: 1s;
  transform-origin: 70% 70%;
  display: inline-block;
`;

export const OnboardingFixedLayout = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  padding: 1rem;
  background-color: ${CV_WHITE};
  z-index: 1000;
`;
OnboardingFixedLayout.displayName = 'OnboardingFixedLayout';

export const OnboardingCenterizeContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  min-height: 100%;
  width: 100%;
  & > * {
    flex-shrink: 0;
  }
`;
OnboardingCenterizeContent.displayName = 'OnboardingCenterizeContent';

export const OnboardingPageDescriptionText = styled.div`
  margin-block-end: 4rem;
  color: ${CV_GRAY};
  text-align: center;
  padding-inline: 4rem;
  max-width: 60rem;
  font-size: 1rem;
`;
OnboardingPageDescriptionText.displayName = 'OnboardingPageDescriptionText';
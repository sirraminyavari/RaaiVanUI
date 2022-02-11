import styled, { keyframes } from 'styled-components';
import Heading from 'components/Heading/Heading';
import { CV_WHITE } from 'constant/CssVariables';

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
WaveContent.displayName = 'WaveContent';

export const OnboardingIntroductionText = styled(Heading)`
  font-size: 3rem !important;
  opacity: 0;
  transform: scale(0);
  transition: opacity 1s, filter 1s, transform 1s;
`;
OnboardingIntroductionText.displayName = 'OnboardingIntroductionText';

export const OnboardingIntroductionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: calc(100vh);
  flex-direction: column;
  background-color: ${CV_WHITE};
  z-index: 1000;
  &.title {
    ${OnboardingIntroductionText}:first-of-type {
      opacity: 1;
      transform: scale(1);
      filter: blur(0);
    }
  }

  &.desc {
    ${OnboardingIntroductionText}:first-of-type {
      opacity: 1;
      transform: scale(0.7);
      filter: blur(4px);
    }
    ${OnboardingIntroductionText}:last-of-type {
      filter: blur(0);
      opacity: 1;
      transform: scale(1);
    }
  }
`;
OnboardingIntroductionWrapper.displayName = 'OnboardingIntroductionWrapper';

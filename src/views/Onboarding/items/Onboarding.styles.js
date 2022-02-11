import styled, { keyframes } from 'styled-components';

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

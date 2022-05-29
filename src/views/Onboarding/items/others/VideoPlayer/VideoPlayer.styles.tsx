import styled from 'styled-components';
import { TCV_WARM, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import { BO_RADIUS_HALF, BO_RADIUS_CIRCLE } from 'constant/constants';

export const VideoPlayerContainer = styled.div<{ isPlaying?: boolean }>`
  position: relative;
  max-width: 100%;
  ${({ isPlaying }) =>
    isPlaying
      ? `
  button {
    opacity:0;
  }
  &:hover {
    button {
        opacity:0.7;
    }
  }
  `
      : `
      
  button {
    opacity:1;
  }
        `}
`;
VideoPlayerContainer.displayName = 'VideoPlayerContainer';

export const VideoPlayerComponentTag = styled.video.attrs({
  className: BO_RADIUS_HALF,
})`
  max-width: 100%;
  width: 100%;
  background-color: ${TCV_WARM};
`;
VideoPlayerComponentTag.displayName = 'VideoPlayerComponentTag';

export const VideoPlayerPrimaryButton = styled.button.attrs({
  className: BO_RADIUS_CIRCLE,
})`
  aspect-ratio: 1;
  width: 5rem;
  background-color: ${CV_WHITE};
  color: ${TCV_DEFAULT};
  box-shadow: 0px 8px 20px #0000004d;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  transition: opacity 0.3s;
`;
VideoPlayerComponentTag.displayName = 'VideoPlayerComponentTag';

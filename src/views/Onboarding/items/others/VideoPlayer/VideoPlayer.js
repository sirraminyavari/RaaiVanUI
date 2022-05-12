import React, { useRef, useState } from 'react';
import * as Styles from './VideoPlayer.styles';
import { FaPlay, FaPause } from 'react-icons/fa';

//TODO remaining work in documenting and event handling
function VideoPlayer({ controls, videoSrcList, ...restProps }) {
  const VideoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const primaryButtonHandler = () => {
    if (isPlaying === false) {
      VideoRef?.current?.play();
    } else {
      VideoRef?.current?.pause();
    }
  };

  return (
    <Styles.VideoPlayerContainer isPlaying={isPlaying}>
      <Styles.VideoPlayerComponentTag
        controls={controls}
        ref={VideoRef}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        {...restProps}
      >
        {videoSrcList.map(({ src, type }) => (
          <source src={src} type={type} />
        ))}

        <p>Your browser cannot play the provided video file.</p>
      </Styles.VideoPlayerComponentTag>
      {!controls && (
        <Styles.VideoPlayerPrimaryButton onClick={primaryButtonHandler}>
          {!isPlaying ? <FaPlay /> : <FaPause />}
        </Styles.VideoPlayerPrimaryButton>
      )}
    </Styles.VideoPlayerContainer>
  );
}

VideoPlayer.defaultProps = {
  videoSrcList: [],
};
VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;

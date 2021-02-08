/**
 * A component for making the background like wave
 */
import React from 'react';
import styled from 'styled-components';
const WavyBackground = () => {
  return <BackgroundImage />;
};
export default WavyBackground;
const Layer1 = styled.div`
  width: 120vw;
  height: 100vw;
  display: flex;
  border-top-left-radius: 110vw;
  border-top-right-radius: 110vw;
  background-color: rgba(21, 17, 60, 0.3);
  position: fixed;
  z-index: 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  top: -1vw;
`;
const Layer2 = styled.div`
  width: 100vw;
  height: 80vw;
  display: flex;
  border-top-left-radius: 80vw;
  border-top-right-radius: 80vw;
  background-color: rgba(21, 17, 60, 0.3);
  position: fixed;
  z-index: 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  top: 10vw;
`;
const Layer3 = styled.div`
  width: 80vw;
  height: 60vw;
  display: flex;
  border-top-left-radius: 80vw;
  border-top-right-radius: 80vw;
  background-color: rgba(21, 17, 60, 0.3);
  position: fixed;
  z-index: 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  top: 20vw;
`;
const BackgroundImage = styled.img`
  src: 'login_bg.jpg';
  width: '100%';
  height: auto;
`;

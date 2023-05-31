/**
 * component style sfor the login screen.
 */
import styled, { keyframes } from 'styled-components';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import Clouds from './clouds.png';

const toRight = keyframes`
  from {
    left: 0rem;

  }

  to {
    left:100%;

  }
`;
const fromLeft = keyframes`
  from {
    left: -100%;

  }

  to {
   left:0rem;

  }
`;
export const BackgroundImage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-image: url(${Clouds});
  background-position: center;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  z-index: 0;
`;

export const Maintainer = styled.div`
  width: 100%;
  display: flex;
  padding-left: calc(100vw - 100%);
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

export const Box = styled.div`
  display: flex;
  width: 100%;
  background-color: white;
  border-radius: 0.8rem;
  flex-direction: column;
  align-items: center;
  align-self: center;
  justify-content: space-between;
  transition: all 1s, max-height 1s, min-height 1s, height 1s, min-width 0.5s;
  position: relative;
  margin-top: 2rem;
  margin-bottom: 3rem;
  min-height: 20vh;
  min-width: 100%;
  padding-bottom: 1rem;
`;

const time = 1;

export const Center = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
export const Wrapper = styled.div`
  width: ${() =>
    DimensionHelper().isTabletOrMobile ? '23.75rem' : '26.75rem'};

  div.transition-group {
    position: relative;
  }
  .fade-enter {
    opacity: 0;
    /* background-color: blueviolet; */
    animation: ${fromLeft} ${time}s;
    position: absolute;
  }

  .fade-enter.fade-enter-active {
    opacity: 1;
    position: absolute;
    transition: opacity ${time}s, min-height ${time}s;
  }

  .fade-exit {
    opacity: 1;
    animation: ${toRight} ${time}s;
    position: absolute;
  }

  .fade-exit.fade-exit-active {
    opacity: 0;
    position: absolute;
    transition: opacity ${time}s, min-height ${time}s;
  }
  section.route-section {
  }
`;

/**
 * component style sfor the login screen.
 */
import styled from 'styled-components';
import Clouds from './clouds.png';
export const BackgroundImage = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  background-image: url(${Clouds});
  background-position: center;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  z-index: -1;
`;

export const Maintainer = styled.div`
  width: '100%';
  display: flex;
  scroll-behavior: smooth;
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
  justify-content: flex-start;
  transition: all 1s, max-height 1s, min-height 1s, height 1s;
  position: relative;
  margin-top: 3rem;
  margin-bottom: 5rem;
  min-height: 10vh;
  padding-bottom: 3rem;
`;
export const Center = styled.div`
  display: flex;
  width: ${({ smallScreen }) => (smallScreen ? '90vw' : '31vw')};
  height: ${({ smallScreen }) => (smallScreen ? '90vh' : '50vh')};
  align-items: center;
  justify-content: center;
`;

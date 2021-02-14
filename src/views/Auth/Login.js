/**
 * A mother component for handling all login events.
 */
import Loader from 'components/Loader/Loader';
import Logo from 'components/Media/Logo';
import React, { Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import WavyBackground from './items/WavyBackground';
import LoginControl from './LoginControl';
import Modal from '../../components/Modal/Modal';
import Confirm from '../../components/Modal/Confirm';

/**
 * A function that handle custom routing between login's screen such as :
 * login,signup,reset password,...
 */
const Login = () => {
  const { currentRoute } = useSelector((state) => state.loginRoute);
  const state = useSelector((state) => state);

  const Signup = React.lazy(() => import('./Signup'));
  // Use React.lazy to increase page loading speed.

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1000px)' });
  // It checks screen dimension.

  useEffect(() => {}, [currentRoute]);

  console.log(state, 'state');

  return (
    <Suspense
      fallback={
        <Maintainer>
          <WavyBackground />
          <Loader />
        </Maintainer>
      }>
      <Maintainer>
        <WavyBackground />
        <Container>
          <Modal>ramin yavari</Modal>

          <Logo />

          <Box smallScreen={isTabletOrMobile}>
            {/* currenRoute handles custom route between login screens */}
            {currentRoute === 'login' ? <LoginControl /> : <Signup />}
          </Box>
        </Container>
      </Maintainer>
    </Suspense>
  );
};

export default Login;

const Maintainer = styled.div`
  background-color: rgb(42, 56, 143);
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 4;
  top: 100vw;
`;
const Box = styled.div`
  display: flex;
  width: ${({ smallScreen }) => (smallScreen ? '90vw' : '40vw')};
  max-width: 90%;
  height: 80vh;
  background-color: white;
  border-radius: 13px;
  flex-direction: column;
  align-items: center;
`;

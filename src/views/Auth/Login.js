/**
 * A mother component for handling all login events.
 */
import Loader from 'components/Loader/Loader';
import Logo from 'components/Media/Logo';
import React, { Suspense, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import ContinueWithGoogle from './elements/ContinueWithGoogle';
import CreateAccountButton from './elements/CreateAccountButton';
import Email from './elements/Email';
import ForgotPassword from './elements/ForgotPassword';
import NavigateButton from './elements/NavigateButton';
import Password from './elements/Password';
import WavyBackground from './items/WavyBackground';
import Description from './elements/Description';
import Return from './elements/Return';

/**
 * A function that handle custom routing between login's screen such as :
 * login,signup,reset password,...
 */
const Login = () => {
  const { currentRoute } = useSelector((state) => state.loginRoute);
  const state = useSelector((state) => state);
  const [fullScreen, setFullScreen] = useState(false);

  // Use React.lazy to increase page loading speed.

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1000px)' });
  // It checks screen dimension.

  return (
    <Maintainer>
      <WavyBackground />
      <Container>
        <Logo />
        <Box smallScreen={isTabletOrMobile}>
          {/* currenRoute handles custom route between login screens */}
          {/* {currentRoute.includes('login') ? <LoginControl /> : <Signup />} */}
          <Email />
          <Password />
          <Description />

          <NavigateButton />
          <ForgotPassword />
          <Return />
          <ContinueWithGoogle />
          <CreateAccountButton />
        </Box>
      </Container>
    </Maintainer>
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
  width: ${({ smallScreen }) => (smallScreen ? '90vw' : '31vw')};
  height: ${({ smallScreen }) => (smallScreen ? '90vh' : '83vh')};
  padding-top: 2.6rem;

  max-height: 80%;
  background-color: white;
  border-radius: 0.8rem;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: all 1s;
`;

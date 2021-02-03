/**
 * A component for signing in with alternative methods.
 */
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import ContinueWithGoogle from './ContinueWithGoogle';
import CreateAccount from './CreateAccountButton';
import ForgetPassword from './ForgetPassword';

const SignInMethods = () => {
  const { currentRoute } = useSelector((state) => state.loginRoute);

  return (
    <Container>
      {currentRoute === 'login' ? <ForgetPassword /> : <div />}
      <Couple>
        <div
          style={{ width: '90%', height: '0.5px', backgroundColor: '#BAC9DC' }}
        />
        <ContinueWithGoogle />
        <CreateAccount />
      </Couple>
    </Container>
  );
};

export default SignInMethods;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Couple = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 13px;
  flex: 0.7;
  justify-content: space-around;
  margin-bottom: 13px;
`;

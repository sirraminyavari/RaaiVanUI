/**
 *  A component for logging in with google account.
 */
import GoogleIcon from 'components/Icons/GoogleIcon';
import React from 'react';
import styled from 'styled-components';
import { MAIN_BLUE } from 'const/Colors';
import { UpToDownAnimate } from './Animate.style';
import { useSelector, useDispatch } from 'react-redux';
import {
  FORGOT_PASSWORD,
  SIGN_IN,
  SIGN_UP_EMAIL,
  SIGN_UP_PASSWORD,
} from 'const/LoginRoutes';

const ContinueWithGoogle = ({ ...props }) => {
  const dispatch = useDispatch();
  const { currentRoute, email } = useSelector((state) => ({
    currentRoute: state.loginRoute.currentRoute,
    email: state.login.email,
  }));
  const isVisible = (currentRoute) => {
    switch (currentRoute) {
      case FORGOT_PASSWORD:
      case SIGN_UP_EMAIL:
      case SIGN_UP_PASSWORD:
        return true;
      case SIGN_IN:
        return email.length === 0;

      default:
        return false;
    }
  };

  const onGoogle = () => {
    console.log('change route');
    // dispatch(setLoginRoute(SIGN_IN));
  };
  return (
    <UpToDownAnimate
      isVisible={isVisible(currentRoute)}
      style={{ marginBottom: '0.4rem' }}>
      <Container {...props} onClick={onGoogle}>
        <GoogleIcon style={{ fontSize: '1.4rem' }} />
        <Label>Continue with Google</Label>
      </Container>
    </UpToDownAnimate>
  );
};
export default ContinueWithGoogle;

const Container = styled.button`
  width: 90%;
  align-self: center;
  text-align: center;
  margin-top: 1.43rem;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  display: flex;
  border: solid ${MAIN_BLUE} 1px;
  border-radius: 0.4rem;
  padding: 0.6rem;
`;
const Label = styled.div`
  color: ${MAIN_BLUE};
  font-size: 1rem;
  margin-left: 0.8rem;
`;

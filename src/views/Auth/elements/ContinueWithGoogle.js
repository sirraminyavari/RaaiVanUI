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
import GoogleLogin from 'react-google-login';

/**
 * It's not completed.
 * @param {*} param0
 */
const ContinueWithGoogle = ({ ...props }) => {
  const dispatch = useDispatch();
  const { currentRoute, email } = useSelector((state) => ({
    currentRoute: state.login.currentRoute,
    email: state.login.email,
  }));
  const isVisible = () => {
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
    // dispatch(setLoginRouteAction(SIGN_IN));
  };
  return (
    <UpToDownAnimate isVisible={isVisible()} style={{ marginTop: '3rem' }}>
      <GoogleLogin
        clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
        buttonText="Continue with Google"
        render={(renderProps) => (
          <Container
            {...props}
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}>
            <GoogleIcon style={{ fontSize: '1.4rem' }} />
            <Label>Continue with Google</Label>
          </Container>
        )}
        onSuccess={() => console.log('success google')}
        onFailure={() => console.log('failed google')}
        cookiePolicy={'single_host_origin'}
      />
    </UpToDownAnimate>
  );
};
export default ContinueWithGoogle;

const Container = styled.button`
  width: 90%;
  align-self: center;
  text-align: center;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  display: flex;
  border: solid ${MAIN_BLUE} 1px;
  border-radius: 0.8rem;
  padding: 0.6rem;
`;
const Label = styled.div`
  color: ${MAIN_BLUE};
  font-size: 1rem;
  margin-left: 0.8rem;
`;

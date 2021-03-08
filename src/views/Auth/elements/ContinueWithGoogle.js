/**
 *  A component for logging in with google account.
 */
import GoogleIcon from 'components/Icons/GoogleIcon';
import React, { useRef } from 'react';
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
  // We use ref to pass component dimension to 'UpToDownAnimate'
  const ref = useRef();

  const { currentRoute, email } = useSelector((state) => ({
    currentRoute: state.auth.currentRoute,
    email: state.auth.email,
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
  /**
   *
   * @param {Object} event - params comes from google api
   * will fire if continuing with google is a success
   */
  const onGoogleSuccess = (event) => {
    console.log('change route');
    // dispatch(setLoginRouteAction(SIGN_IN));
  };
  /**
   *
   * @param {Object} event - params comes from google api
   * will fire if continuing with google is a fail
   */
  const onGoogleFailed = (event) => {
    console.log('change route');
    // dispatch(setLoginRouteAction(SIGN_IN));
  };

  return (
    // <UpToDownAnimate
    //   ref={ref}
    //   dimension={ref?.current?.getBoundingClientRect()}
    //   isVisible={isVisible()}
    //   style={{ marginTop: '3rem' }}>
    <GoogleLogin
      clientId="823176443658-4ku8pma0s4qfodf8hrq360ood9fds29o.apps.googleusercontent.com"
      buttonText="Continue with Google"
      render={(renderProps) => (
        <Container
          {...props}
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}>
          <Label>Continue with Google</Label>
          <GoogleIcon style={{ fontSize: '1.4rem' }} />
        </Container>
      )}
      onSuccess={onGoogleSuccess}
      onFailure={onGoogleFailed}
      cookiePolicy={'single_host_origin'}
    />
    // </UpToDownAnimate>
  );
};
export default ContinueWithGoogle;

const Container = styled.div`
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

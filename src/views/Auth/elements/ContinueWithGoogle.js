/**
 *  A component for logging in with google account.
 */
import Button from 'components/Buttons/Button';
import GoogleIcon from 'components/Icons/GoogleIcon';
import { TCV_DEFAULT } from 'constant/CssVariables';
import React from 'react';
import GoogleLogin from 'react-google-login';
import styled from 'styled-components';

/**
 * It's not completed.
 * @param {*} param0
 */
const ContinueWithGoogle = ({ ...props }) => {
  // We use ref to pass component dimension to 'UpToDownAnimate'

  const { RVDic, RVGlobal } = window;

  /**
   *
   * @param {Object} event - params comes from google api
   * will fire if continuing with google is a success
   */
  const onGoogleSuccess = (event) => {
    console.log(event);
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
  };

  return (
    <GoogleLogin
      clientId={(RVGlobal || {}).GoogleSignInClientID}
      buttonText={RVDic.SignInWithGoogle}
      render={(renderProps) => (
        <Button
          type={'primary-o'}
          onClick={renderProps.onClick}
          style={{ width: '100%' }}
          {...props}
          disabled={renderProps.disabled}>
          <GoogleIcon style={{ fontSize: '1rem' }} />
          <Label>{RVDic.SignInWithGoogle}</Label>
        </Button>
      )}
      onSuccess={onGoogleSuccess}
      onFailure={onGoogleFailed}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default ContinueWithGoogle;

const Label = styled.div`
  color: ${TCV_DEFAULT};
  font-size: 0.8rem;
  margin: 0 0.8rem;
`;

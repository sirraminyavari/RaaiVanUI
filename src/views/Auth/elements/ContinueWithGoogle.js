/**
 *  A component for logging in with google account.
 */
import Button from 'components/Buttons/Button';
import GoogleIcon from 'components/Icons/GoogleIcon';
import { CV_DISTANT } from 'constant/CssVariables';
import React from 'react';
import GoogleLogin from 'react-google-login';
import styled from 'styled-components';

/**
 * It's not completed.
 * @param {*} param0
 */
const ContinueWithGoogle = ({ ...props }) => {
  // We use ref to pass component dimension to 'UpToDownAnimate'

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
  };

  return (
    <GoogleLogin
      clientId="823176443658-4ku8pma0s4qfodf8hrq360ood9fds29o.apps.googleusercontent.com"
      buttonText="Continue with Google"
      render={(renderProps) => (
        <Button
          type={'primary-o'}
          onClick={renderProps.onClick}
          style={{ width: '100%' }}
          {...props}
          disabled={renderProps.disabled}>
          <Label>Continue with Google</Label>
          <GoogleIcon style={{ fontSize: '1rem' }} />
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
  color: ${CV_DISTANT};
  font-size: 0.8rem;
  margin-left: 0.8rem;
`;

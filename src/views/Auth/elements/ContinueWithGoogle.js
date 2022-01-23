/**
 *  A component for logging in with google account.
 */
import Button from 'components/Buttons/Button';
import GoogleIcon from 'components/Icons/GoogleIcon';
import { TCV_DEFAULT } from 'constant/CssVariables';
import { Base64 } from 'js-base64';
import React from 'react';
import GoogleLogin from 'react-google-login';
import { useDispatch, useSelector } from 'react-redux';
import loggedInAction from 'store/actions/auth/loggedInAction';
import styled from 'styled-components';
import APIHandler from 'apiHelper/APIHandler';
import { getCaptchaToken } from 'helpers/helpers';
import afterLogin from 'utils/OnboardingRoute/afterLogin';
import setAuthUserAction from 'store/actions/auth/setAuthUserAction';

/**
 * It's not completed.
 * @param {*} param0
 */
const ContinueWithGoogle = ({ ...props }) => {
  // We use ref to pass component dimension to 'UpToDownAnimate'

  const { RVDic, RVGlobal, GlobalUtilities } = window;

  const dispatch = useDispatch();

  const reqParams = GlobalUtilities.request_params();

  const googleSignInAPI = new APIHandler('UsersAPI', 'SignInWithGoogle');

  /**
   *
   * @param {Object} event - params comes from google api
   * will fire if continuing with google is a success
   */
  const onGoogleSuccess = async (event) => {
    const gProfile = event?.profileObj;

    const captchaToken = await getCaptchaToken();

    googleSignInAPI.fetch(
      {
        Captcha: captchaToken,
        GoogleToken: event?.tokenObj?.id_token,
        Email: gProfile?.email,
        FirstName: Base64.encode(gProfile?.givenName),
        LastName: Base64.encode(gProfile?.familyName),
        GoogleID: gProfile?.googleId,
        ImageURL: gProfile?.imageUrl,
        InvitationID: reqParams.get_value('inv'),
      },
      (result) => {
        console.log('result', result);

        if (result.ErrorText) {
          alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
        } else if (result.Succeed) {
          console.log(result, 'result google');
          // afterLogin(result);

          dispatch(loggedInAction(result));
          // dispatch(setAuthUserAction(result?.User));
          // window.RVGlobal.IsAuthenticated = true;
          // window.location.href = afterLogin(response) || '/workspaces';
        }
      }
    );
  };

  /**
   *
   * @param {Object} event - params comes from google api
   * will fire if continuing with google is a fail
   */
  const onGoogleFailed = (event) => {
    console.log('change route');
  };

  return !(RVGlobal || {}).GoogleSignInClientID ? (
    <></>
  ) : (
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

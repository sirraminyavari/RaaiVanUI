/**
 *  A component for logging in with google account.
 */
import Button from 'components/Buttons/Button';
import GoogleIcon from 'components/Icons/GoogleIcon';
import { TCV_DEFAULT } from 'constant/CssVariables';
import { Base64 } from 'js-base64';
import { useState } from 'react';
import GoogleLogin from 'react-google-login';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import APIHandler from 'apiHelper/APIHandler';
import { getCaptchaToken } from 'helpers/helpers';
import { useAuthSlice } from 'store/slice/auth';

/**
 * It's not completed.
 * @param {*} param0
 */
const ContinueWithGoogle = ({ ...props }) => {
  // We use ref to pass component dimension to 'UpToDownAnimate'

  const { RVDic, RVGlobal, GlobalUtilities } = window;

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { actions: authActions } = useAuthSlice();

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

          dispatch(authActions.loggedIn(result));
          // dispatch(setAuthUserAction(result?.User));
          // window.RVGlobal.IsAuthenticated = true;
          // window.location.href = afterLogin(response) || '/workspaces';
        }
        setLoading(false);
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
    setLoading(false);
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
          disabled={renderProps.disabled}
          loading={loading}
        >
          <GoogleIcon style={{ fontSize: '1rem' }} />
          <Label>{RVDic.SignInWithGoogle}</Label>
        </Button>
      )}
      onRequest={() => setLoading(true)}
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
  text-transform: lowercase;
  &:first-letter {
    text-transform: uppercase;
  }
`;

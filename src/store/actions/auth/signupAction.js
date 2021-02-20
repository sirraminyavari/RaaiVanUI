/**
 * An action for final step of signing up
 */
import { loginSlice } from '../../reducers/loginReducer';

const {
  signup,
  signupSuccess,
  signupFailed,
  setVerifyCodeError,
} = loginSlice.actions;

const { UsersAPI, GlobalUtilities, location, RVDic, RVAPI } = window;

const signupAction = () => async (dispatch, getState) => {
  // comes from redux state
  const code = getState().login.verifyCode;
  // comes from redux state
  const confirmationToken = getState().login.verifyCodeToken;
  /**
   * After checking verification code,
   * 'signingUp()' will be called.
   * Here, just calling some functions occurs, the main procedure of connecting to server
   * is being handled with 'UsersAPI'.
   */
  const signingUp = () => {
    dispatch(signup());

    try {
      UsersAPI.ValidateUserCreation({
        VerificationToken: confirmationToken,
        Code: code.join(''),
        Login: true,
        ParseResults: true,
        ResponseHandler: function (result) {
          console.log(result, 'signup success');
          if (result.ErrorText) {
            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
            dispatch(signupFailed(result));
          } else if (result.AuthCookie) {
            dispatch(signupSuccess());

            RVAPI.LoggedIn();
            GlobalUtilities.set_auth_cookie(result.AuthCookie);
            location.href = location.href;
          }
        },
      });
    } catch (err) {
      console.log(err, 'error');

      dispatch(signupFailed(err));
    }
  };
  //Checks code length with code length came from password policy.
  code.length !== getState().login.verifyCodeLength
    ? dispatch(setVerifyCodeError('کد تایید وارد شده صحیح نیست'))
    : signingUp();
};
export default signupAction;

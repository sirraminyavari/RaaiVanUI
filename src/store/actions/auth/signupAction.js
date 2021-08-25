/**
 * An action for final step of signing up
 */
import afterLogin from 'utils/OnboardingRoute/afterLogin';
import { loginSlice } from '../../reducers/loginReducer';

const {
  signup,
  signupSuccess,
  signupFailed,
  setVerifyCodeError,
} = loginSlice.actions;

const { UsersAPI, GlobalUtilities, location, RVDic, RVAPI, RVGlobal } = window;

const signupAction = () => async (dispatch, getState) => {
  // comes from redux state
  const code = getState().auth.verifyCode;
  // comes from redux state
  const confirmationToken = getState().auth.verifyCodeToken;
  /**
   * After checking verification code,
   * 'signingUp()' will be called.
   * Here, just calling some functions occurs, the main process of connecting to server
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
          console.log(result, 'signup result');
          if (result.ErrorText) {
            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
            dispatch(signupFailed(result));
            dispatch(
              setVerifyCodeError(
                RVDic.MSG[result.ErrorText] || result.ErrorText
              )
            );
          } else if (result.AuthCookie) {
            // (RVGlobal || {}).CurrentUser = result?.User;
            dispatch(signupSuccess());

            //ask ramin

            const newUrl = afterLogin(result);

            location.href = newUrl || location.href;
          }
        },
      });
    } catch (err) {
      console.log(err, 'error');

      dispatch(signupFailed(err));
    }
  };
  //Checks code length with code length came from password policy.
  code.length !== getState().auth.verifyCodeLength
    ? dispatch(setVerifyCodeError(RVDic.MSG['VerificationCodeDidNotMatch']))
    : signingUp();
};
export default signupAction;

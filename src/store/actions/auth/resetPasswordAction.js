import afterLogin from 'utils/OnboardingRoute/afterLogin';

/**
 * The action for resetting the password in the final step.
 */
const { loginSlice } = require('store/reducers/loginReducer');

const {
  resetPassword,
  resetPasswordSuccess,
  resetPasswordFailed,
  setVerifyCodeError,
} = loginSlice.actions;

const { UsersAPI, RVDic, GlobalUtilities, location, RVAPI } = window;

const resetPasswordAction = () => async (dispatch, getState) => {
  // comes from redux state
  const code = getState().auth.verifyCode;
  // comes from redux state
  const confirmationToken = getState().auth.verifyCodeToken;

  const resetPass = () => {
    dispatch(resetPassword());
    // Calls 'UsersAPI.SetPassword' for the final step of resetting password
    try {
      UsersAPI.SetPassword({
        VerificationToken: confirmationToken,
        Code: code.join(''),
        Login: true,
        ResponseHandler: async (response) => {
          const result = response && JSON.parse(response);
          console.log(result, 'error for final reset step');

          if (result.ErrorText) {
            dispatch(
              resetPasswordFailed(
                RVDic.MSG[result.ErrorText] || result.ErrorText
              )
            );
          } else {
            dispatch(resetPasswordSuccess());
            // RVAPI.LoggedIn();

            // GlobalUtilities.set_auth_cookie(result.AuthCookie);
            //ask ramin
            const afterLoginResult = await afterLogin(result);

            location.href = afterLoginResult || location.href;
          }
        },
      });
    } catch (err) {
      dispatch(resetPasswordFailed(err));
    }
  };
  //Checks code length with code length came from password policy.
  code.length !== getState().auth.verifyCodeLength
    ? dispatch(setVerifyCodeError(RVDic.MSG['VerificationCodeDidNotMatch']))
    : resetPass();
};

export default resetPasswordAction;

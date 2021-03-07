/**
 * An action for resending the verification code
 */
import { loginSlice } from '../../reducers/loginReducer';
const {
  reSendVerifyCode,
  reSendVerifyCodeSuccess,
  reSendVerifyCodeFailed,
} = loginSlice.actions;

const { RVAPI, RVDic } = window;
/**
 * The process of resending the verification code will do here with help of Thunk.
 * See @link https://github.com/reduxjs/redux-thunk for more info.
 */
const reSendVerifyCodeAction = () => async (dispatch, getState) => {
  /**
   * After checking resendVerifyCodeToken,
   * 'reSendCode()' will be called.
   * Here, just calling some functions occurs, the main procedure of connecting to server
   * is being handled with 'RVAPI'.
   */
  const reSendCode = () => {
    dispatch(reSendVerifyCode());
    const resendVerifyCodeToken = getState().auth.resendVerifyCodeToken;
    if (resendVerifyCodeToken) {
      try {
        RVAPI.ResendVerificationCode({
          Token: getState().auth.resendVerifyCodeToken,
          ParseResults: true,
          ResponseHandler: function (result) {
            if (result.ErrorText) {
              alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
              dispatch(reSendVerifyCodeFailed(result));
            } else {
              dispatch(reSendVerifyCodeSuccess(result));
            }
          },
        });
      } catch (err) {
        dispatch(reSendVerifyCodeFailed(err));
      }
    }
  };

  reSendCode();
};
export default reSendVerifyCodeAction;

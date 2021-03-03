/**
 * An action for sending a link to reset the password.
 */
import { loginSlice } from '../../reducers/loginReducer';
import { encode } from 'js-base64';

const {
  sendResetPasswordLink,
  sendResetPasswordLinkSuccess,
  sendResetPasswordLinkFailed,
  setEmailError,
} = loginSlice.actions;

const { GlobalUtilities, UsersAPI, RVDic } = window;
/**
 * Sending reset pass request with help of Thunk.
 * See @link https://github.com/reduxjs/redux-thunk for more info.
 * @param {String} email - mobile number or email entered.
 */
const sendResetPsswordLinkAction = ({ email }) => async (dispatch) => {
  const sendTicket = () => {
    try {
      // Sends reset-password request to server
      UsersAPI.SetPasswordResetTicket({
        Email: encode(GlobalUtilities.secure_string(email)),
        ParseResults: true,
        ResponseHandler: function (result) {
          if (result.ErrorText) {
            dispatch(sendResetPasswordLinkFailed(result.ErrorText));
            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
          } else if (result.Succeed) {
            alert(RVDic.MSG['AnEmailContainingPasswordResetLinkSentToYou']);
            dispatch(sendResetPasswordLinkSuccess());
          }
        },
      });
    } catch (err) {
      console.log(err, 'error');

      dispatch(sendResetPasswordLinkFailed(err));
    }
  };
  if (email) {
    dispatch(sendResetPasswordLink());
    sendTicket();
  } else {
    !email && dispatch(setEmailError('ایمیل نمیتواند خالی باشد'));
  }
};
export default sendResetPsswordLinkAction;

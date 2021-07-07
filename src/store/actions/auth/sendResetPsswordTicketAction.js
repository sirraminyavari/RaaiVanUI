/**
 * An action for sending a link to reset the password.
 */
import { loginSlice } from '../../reducers/loginReducer';
import { encode } from 'js-base64';
import CheckPassword from 'utils/Validation/CheckPassword';
import MobileNumberValidator from 'utils/Validation/MobileNumberValidator';
import { getCaptchaToken } from 'helpers/helpers';

const {
  sendResetPasswordTicket,
  sendResetPasswordTicketSuccessAddress,
  sendResetPasswordTicketSuccessVerification,
  sendResetPasswordTicketFailed,
  setEmailError,
  setPasswordError,
} = loginSlice.actions;

/**
 * Sending reset pass request with help of Thunk.
 * See @link https://github.com/reduxjs/redux-thunk for more info.
 * @param {String} email - mobile number or email entered.
 */
const sendResetPsswordTicketAction = ({ email, password }) => async (
  dispatch,
  getState
) => {
  const { GlobalUtilities, UsersAPI, RVDic } = window;
  const reqParams = GlobalUtilities.request_params();

  const captchaToken = await getCaptchaToken();

  // const captchaToken = getState().auth.captchaToken;

  const sendTicket = () => {
    dispatch(sendResetPasswordTicket());

    try {
      // Sends reset-password request to server
      UsersAPI.SetPasswordResetTicket({
        UserName: encode(GlobalUtilities.secure_string(email)),
        Password: password,
        ParseResults: true,
        Captcha: captchaToken,
        InvitationID: reqParams.get_value('inv'),
        ResponseHandler: function (result) {
          if (result.ErrorText) {
            dispatch(sendResetPasswordTicketFailed(result.ErrorText));
            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
          } else if (result.VerificationCode) {
            alert(RVDic.MSG['AnEmailContainingPasswordResetLinkSentToYou']);
            dispatch(
              sendResetPasswordTicketSuccessVerification({
                route: '/auth/verifyingResetPassword',
                VerificationCode: result,
              })
            );
          } else if (result.Email || result.Phone) {
            dispatch(
              sendResetPasswordTicketSuccessAddress({
                route: '/auth/resetPasswordAddress',
                address: result,
              })
            );
          }
        },
      });
    } catch (err) {
      console.log(err, 'error');

      dispatch(sendResetPasswordTicketFailed(err));
    }
  };

  !(GlobalUtilities.is_valid_email(email) || MobileNumberValidator(email))
    ? //ask ramin
      dispatch(setEmailError(`!ایمیل یا شماره موبایل وارد شده صحیح نیست`))
    : // Checks inputted password, with Password Policy comes from server.

    !CheckPassword(password, getState().auth?.passwordPolicy)
    ? dispatch(setPasswordError('الگو رمزعبور وارد شده صحیح نیست'))
    : // Checks inputted name if is Persian with Persian chars.

      sendTicket();
};
export default sendResetPsswordTicketAction;

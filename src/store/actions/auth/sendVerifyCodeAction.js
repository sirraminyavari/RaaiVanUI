/**
 * An action for sending verification code.
 */
import { getCaptchaToken } from 'helpers/helpers';
import { encode } from 'js-base64';
import CheckPassword from 'utils/Validation/CheckPassword';
import MobileNumberValidator from 'utils/Validation/MobileNumberValidator';
import { loginSlice } from '../../reducers/loginReducer';

const {
  sendVerifyCodeFailed,
  sendVerifyCodeSuccess,
  sendVerifyCode,
  setEmailError,
  setPasswordError,
} = loginSlice.actions;

/**
 * Sending request for verification code thanks to Thunk
 * See @link https://github.com/reduxjs/redux-thunk for more info.
 * @param {String} email - Inputted user email/mobile for signing up.
 * @param {String} password - Inputted user password for signing up.
 * @param {String} name - Inputted user name for signing up.
 * @param {String} family - Inputted user family for signing up.
 */
const sendVerifyCodeAction = ({ email, password, name, family }) => async (
  dispatch
) => {
  const { GlobalUtilities, UsersAPI, RVDic } = window;
  const reqParams = GlobalUtilities.request_params();

  /**
   * After checking email,password,name,family validation,
   * 'sendCode()' will be called.
   * The main process of server connecting will occur in 'UsersAPI'.
   * Here,just calling some functions occurs.
   */
  const captchaToken = await getCaptchaToken();

  const sendCode = () => {
    dispatch(sendVerifyCode());
    try {
      UsersAPI.CreateUserToken({
        FirstName: encode(name),
        LastName: encode(family),
        Contact: email,
        Password: encode(password),
        InvitationID: reqParams.get_value('inv'),
        ParseResults: true,
        Captcha: captchaToken,
        ResponseHandler: function (results) {
          if (results.ErrorText) {
            dispatch(sendVerifyCodeFailed());

            alert(RVDic.MSG[results.ErrorText] || results.ErrorText, {
              autoClose: 20000,
            });
          } else if (results.VerificationCode) {
            dispatch(sendVerifyCodeSuccess(results));
          }
        },
      });
    } catch (err) {
      dispatch(sendVerifyCodeFailed(err));
    }
  };

  sendCode();

  //getState().auth?.passwordPolicy
};

export default sendVerifyCodeAction;

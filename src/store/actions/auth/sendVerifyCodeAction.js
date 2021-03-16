/**
 * An action for sending verification code.
 */
import { encode } from 'js-base64';
import CheckPassword from 'utils/Validation/CheckPassword';
import MobileNumberValidator from 'utils/Validation/MobileNumberValidator';
import PasswordValidator from 'utils/Validation/PasswordValidator';
import PersianValidator from 'utils/Validation/PersianValidator';
import { loginSlice } from '../../reducers/loginReducer';
const {
  sendVerifyCodeFailed,
  sendVerifyCodeSuccess,
  sendVerifyCode,
  setEmailError,
  setPasswordError,
  setNameError,
  setFamilyError,
} = loginSlice.actions;

const { GlobalUtilities, UsersAPI, RVDic } = window;
const reqParams = GlobalUtilities.request_params();
/**
 * Sending request for verification code thanks to Thunk
 * See @link https://github.com/reduxjs/redux-thunk for more info.
 * @param {String} email - Inputted user email/mobile for signing up.
 * @param {String} password - Inputted user password for signing up.
 * @param {String} name - Inputted user name for signing up.
 * @param {String} family - Inputted user family for signing up.
 */
const sendVerifyCodeAction = ({ email, password, name, family }) => async (
  dispatch,
  getState
) => {
  /**
   * After checking email,password,name,family validation,
   * 'sendCode()' will be called.
   * The main process of server connecting will occur in 'UsersAPI'.
   * Here,just calling some functions occurs.
   */
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
        Captcha: getState().auth.captchaToken,
        ResponseHandler: function (results) {
          if (results.ErrorText) {
            dispatch(sendVerifyCodeFailed());

            alert(RVDic.MSG[results.ErrorText] || results.ErrorText, {
              Timeout: 20000,
            });
          } else if (results.VerificationCode) {
            console.log(results, 'result');
            dispatch(sendVerifyCodeSuccess(results));
          }
        },
      });
    } catch (err) {
      dispatch(sendVerifyCodeFailed(err));
    }
  };
  // Checks inputted email/mobile
  !(GlobalUtilities.is_valid_email(email) || MobileNumberValidator(email))
    ? dispatch(setEmailError('!' + 'ایمیل یا شماره موبایل وارد شده صحیح نیست'))
    : // Checks inputted password, with Password Policy comes from server.

    !CheckPassword(password, getState().auth?.passwordPolicy)
    ? dispatch(setPasswordError('الگو رمزعبور وارد شده صحیح نیست'))
    : // Checks inputted name if is Persian with Persian chars.
    !PersianValidator(name)
    ? dispatch(setNameError('نام وارد شده باید فارسی باشد'))
    : // Checks inputted family if is Persian with Persian chars.
    !PersianValidator(family)
    ? dispatch(setFamilyError('نام خانوادگی وارد شده باید فارسی باشد'))
    : // After checking all passed params, 'sendCode()' will be called.
      sendCode();
};
export default sendVerifyCodeAction;

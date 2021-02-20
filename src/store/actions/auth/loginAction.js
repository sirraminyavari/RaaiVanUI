/**
 * An action for Signing in
 */
import { loginSlice } from '../../reducers/loginReducer';
import APIHandler from '../../../apiHelper/APIHandler';
import { encode } from 'js-base64';
const {
  login,
  loginResult,
  loginFailed,
  setPasswordError,
  setEmailError,
} = loginSlice.actions;

// Loads 'RVAPI' Class and 'Login' Function.
const apiHandler = new APIHandler('RVAPI', 'Login');

/**
 * The process of signing in will do here with help of Thunk.
 * See @link https://github.com/reduxjs/redux-thunk for more info.
 * @param {String} email -  Email or mobile number entered.
 * @param {String} password - Password entered.
 */
const loginAction = ({ email, password }) => async (dispatch) => {
  /**
   * After checking email & password,
   * 'signin()' will be called.
   * 'pass' and 'username' have to be encoded to Base64.
   * Here, just calling some functions occurs, the main procedure of connecting to server
   * is being handled with 'RVAPI'.
   */
  const signin = () => {
    try {
      apiHandler.fetch(
        {
          UserName: encode(email),
          Password: encode(password),
        },
        (response) => {
          const { Succeed, AuthCookie } = response;
          const { RVAPI, GlobalUtilities } = window;
          if (Succeed && AuthCookie) {
            // These three following lines should be done to login precdure be completed
            window.isAuthenticated = true;
            RVAPI.LoggedIn();
            GlobalUtilities.set_auth_cookie(AuthCookie);
            dispatch(loginResult(response));
          }
        },
        (err) => {
          console.log(err, 'error');

          dispatch(loginFailed(err));
        }
      );
    } catch (err) {
      console.log(err, 'error');
      dispatch(loginFailed(err));
    }
  };
  if (email && password) {
    dispatch(login());
    signin();
  } else {
    // Checks if password is null.
    !password && dispatch(setPasswordError('رمز عبور نمیتواند خالی باشد'));
    // Checks if email is null.
    !email && dispatch(setEmailError('ایمیل نمیتواند خالی باشد'));
  }
};
export default loginAction;

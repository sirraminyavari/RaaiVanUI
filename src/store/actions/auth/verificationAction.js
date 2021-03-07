import { loginSlice } from '../../reducers/loginReducer';
import APIHandler from '../../../apiHelper/APIHandler';

const { verification } = loginSlice.actions;
const apiHandler = new APIHandler('RVAPI', 'Login');

const verificationAction = (params) => async (dispatch) => {
  dispatch(verification());
  try {
    // apiHandler.fetch(
    //   {
    //     UserName: params.userName,
    //     Password: params.password,
    //   },
    //   (response) => {
    //     console.log(response, params, 'login response');
    //     const { Succeed, AuthCookie } = response;
    //     const { RVAPI, GlobalUtilities } = window;
    //     if (Succeed && AuthCookie) {
    //       window.isAuthenticated = true;
    //       RVAPI.LoggedIn();
    //       GlobalUtilities.set_auth_cookie(AuthCookie);
    //     }
    //     dispatch(loginResult(response));
    //   },
    //   (err) => {
    //     console.log(err, 'error');
    //     dispatch(loginFailed(err));
    //   }
    // );
  } catch (err) {
    // console.log(err, 'error');
    // dispatch(loginFailed(err));
  }
};
export default verificationAction;

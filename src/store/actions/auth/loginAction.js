import { loginSlice } from '../../reducers/loginReducer';
import APIHandler from '../../../apiHelper/APIHandler';

const { loginAction, loginResult, loginFailed } = loginSlice.actions;
const apiHandler = new APIHandler('RVAPI', 'Login');

const login = (params) => async (dispatch) => {
  dispatch(loginAction());
  try {
    apiHandler.fetch(
      {
        UserName: params.UserName,
        Password: params.Password,
      },
      (response) => {
        dispatch(loginResult(response));
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
export default login;

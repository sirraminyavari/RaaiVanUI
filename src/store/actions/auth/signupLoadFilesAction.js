/**
 * An action for getting required files during sign up from server.
 */
import { SIGN_UP_EMAIL } from 'constant/LoginRoutes';
import { loginSlice } from '../../reducers/loginReducer';
import setLoginRouteAction from './setLoginRouteAction';

const {
  signupLoadFiles,
  signupLoadFilesSuccess,
  signupLoadFilesFailed,
  setEmail,
  setPassword,
} = loginSlice.actions;

const signupLoadFilesAction = (destination) => async (dispatch) => {
  dispatch(signupLoadFiles());

  try {
    dispatch(setLoginRouteAction(SIGN_UP_EMAIL));
    //dispatch(setEmail(''));
    dispatch(setPassword(''));
    dispatch(signupLoadFilesSuccess({ destination }));
  } catch (err) {
    dispatch(signupLoadFilesFailed(err));
  }
};
export default signupLoadFilesAction;

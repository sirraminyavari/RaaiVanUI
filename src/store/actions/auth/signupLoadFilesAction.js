/**
 * An action for getting required files during sign up from server.
 */
import { SIGN_UP_EMAIL } from 'const/LoginRoutes';
import { loginSlice } from '../../reducers/loginReducer';
import setLoginRouteAction from './setLoginRouteAction';

const {
  signupLoadFiles,
  signupLoadFilesSuccess,
  signupLoadFilesFailed,
  setEmail,
  setPassword,
} = loginSlice.actions;
const { GlobalUtilities, UsersAPI } = window;

const signupLoadFilesAction = (destination) => async (dispatch) => {
  dispatch(signupLoadFiles());

  try {
    GlobalUtilities.load_files(
      ['API/UsersAPI.js', 'API/CNAPI.js', 'USR/ChangePasswordDialog.js'],
      {
        OnLoad: function () {
          UsersAPI.GetPasswordPolicy({
            ParseResults: true,
            ResponseHandler: function (result) {
              dispatch(setLoginRouteAction(SIGN_UP_EMAIL));
              dispatch(setEmail(''));
              dispatch(setPassword(''));
              dispatch(signupLoadFilesSuccess({ result, destination }));
            },
          });
        },
      }
    );
  } catch (err) {
    dispatch(signupLoadFilesFailed(err));
  }
};
export default signupLoadFilesAction;

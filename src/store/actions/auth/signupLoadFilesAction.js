/**
 * An action for getting required files during sign up from server.
 */
import { loginSlice } from '../../reducers/loginReducer';

const {
  signupLoadFiles,
  signupLoadFilesSuccess,
  signupLoadFilesFailed,
} = loginSlice.actions;
const { GlobalUtilities, UsersAPI } = window;

const signupLoadFilesAction = () => async (dispatch) => {
  dispatch(signupLoadFiles());
  try {
    GlobalUtilities.load_files(
      ['API/UsersAPI.js', 'API/CNAPI.js', 'USR/ChangePasswordDialog.js'],
      {
        OnLoad: function () {
          UsersAPI.GetPasswordPolicy({
            ParseResults: true,
            ResponseHandler: function (result) {
              dispatch(signupLoadFilesSuccess(result));
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

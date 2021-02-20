/**
 * An action for setting if input password is focused.
 */
import { loginSlice } from 'store/reducers/loginReducer';

const { setPasswordFocus } = loginSlice.actions;
/**
 * By this action, other Components will know that if password input is focused or not.
 * It's useful for some Components like: 'PasswordValidation' or 'Description'
 * @param {Boolean} params - True if Password input is focused.
 */
const setPasswordFocusAction = (params) => (dispatch) => {
  dispatch(setPasswordFocus(params));
};
export default setPasswordFocusAction;

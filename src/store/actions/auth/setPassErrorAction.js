/**
 * An action for setting password error to Redux state
 */
import { loginSlice } from 'store/reducers/loginReducer';

const { setPasswordError } = loginSlice.actions;

/**
 * This action setts error of password to Redux state.
 * @param {String} params - An error that validator or server relates it to the inputted password.
 */
const setPasswordErrorAction = (params) => (dispatch) => {
  dispatch(setPasswordError(params));
};
export default setPasswordErrorAction;

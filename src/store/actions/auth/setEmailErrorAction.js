/**
 * An action for setting email error to Redux state
 */
import { loginSlice } from 'store/reducers/loginReducer';

const { setEmailError } = loginSlice.actions;

/**
 * This action setts error of email to Redux state.
 * @param {String} params - An error that validator or server relates it to the inputted email.
 */
const setEmailErrorAction = (params) => (dispatch) => {
  dispatch(setEmailError(params));
};
export default setEmailErrorAction;

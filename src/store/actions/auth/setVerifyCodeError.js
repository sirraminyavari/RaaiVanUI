/**
 * An action for setting verification error error to Redux state
 */
import { loginSlice } from 'store/reducers/loginReducer';

const { setVerifyCodeError } = loginSlice.actions;
/**
 * This action setts error of email to Redux state.
 * @param {String} params - An error that validator or server relates it to the inputted verification error.
 */
const setVerifyCodeErrorAction = (params) => (dispatch) => {
  dispatch(setVerifyCodeError(params));
};
export default setVerifyCodeErrorAction;

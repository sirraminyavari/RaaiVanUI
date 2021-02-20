/**
 * An action for setting password to Redux state
 */
import { loginSlice } from 'store/reducers/loginReducer';

const { setPassword } = loginSlice.actions;

/**
 * This action is connected to 'onChange' callback of input.
 * By typing the user, the Redux state will update synchronously.
 * @param {String} params - An password that user is typing.
 */
const setPasswordAction = (params) => (dispatch) => {
  dispatch(setPassword(params));
};
export default setPasswordAction;

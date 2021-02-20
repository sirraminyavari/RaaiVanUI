/**
 * An action for setting email to Redux state
 */
import { loginSlice } from 'store/reducers/loginReducer';

const { setEmail } = loginSlice.actions;

/**
 * This action is connected to 'onChange' callback of input.
 * By typing the user, the Redux state will update synchronously.
 * @param {String} params - An email/mobile that user is typing.
 */
const setEmailAction = (params) => (dispatch) => {
  dispatch(setEmail(params));
};
export default setEmailAction;

/**
 * An action for setting name to Redux state
 */
import { loginSlice } from 'store/reducers/loginReducer';

const { setName } = loginSlice.actions;

/**
 * This action is connected to 'onChange' callback of input.
 * By typing the user, the Redux state will update synchronously.
 * @param {String} params - An name that user is typing.
 */
const setNameAction = (params) => (dispatch) => {
  dispatch(setName(params));
};
export default setNameAction;

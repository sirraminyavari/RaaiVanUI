/**
 * An action for setting name to Redux state
 */
import { loginSlice } from 'store/reducers/loginReducer';

const { setIsAthunticated } = loginSlice.actions;

/**
 * This action is connected to 'onChange' callback of input.
 * By typing the user, the Redux state will update synchronously.
 * @param {Boolean} params - An name that user is typing.
 */
const setIsAthunticatedAction = (params) => (dispatch) => {
  dispatch(setIsAthunticated(params));
};
export default setIsAthunticatedAction;

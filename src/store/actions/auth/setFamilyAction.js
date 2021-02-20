/**
 * An action for setting family to Redux state
 */
import { loginSlice } from 'store/reducers/loginReducer';

const { setFamily } = loginSlice.actions;
/**
 * This action is connected to 'onChange' callback of input.
 * By typing the user, the Redux state will update synchronously
 * @param {String} params - An family that user is typing
 */
const setFamilyAction = (params) => (dispatch) => {
  dispatch(setFamily(params));
};
export default setFamilyAction;

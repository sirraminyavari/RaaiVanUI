/**
 * An action for setting selected orgDomain to Redux state.
 */
import { loginSlice } from 'store/reducers/loginReducer';

const { setCaptchaToken } = loginSlice.actions;

/**
 * This action is connected to 'onSelectItem' callback of OrgDomains.
 * By selecting the user, the Redux state will update synchronously.
 * @param {{Value:String,Title:String}} params - Selected orgDomain.
 */
const setCaptchaTokenAction = (params) => (dispatch) => {
  dispatch(setCaptchaToken(params));
};
export default setCaptchaTokenAction;

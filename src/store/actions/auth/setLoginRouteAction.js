/**
 * An action for defining the the login 'currentRoute'
 */
import { loginSlice } from 'store/reducers/loginReducer';

const { resetAllErrors, setLoginRoute } = loginSlice.actions;
/**
 * By calling this action, the content of the login screen will change without reloading the page.
 * @param {String} params - New route for login that user should see in next step
 */
const setLoginRouteAction = (params) => (dispatch) => {
  // When current route changes, all the errors will reset.
  dispatch(resetAllErrors());
  dispatch(setLoginRoute(params));
};
export default setLoginRouteAction;

/**
 * An action for setting domains of organs to Redux state
 */
import { loginSlice } from 'store/reducers/loginReducer';

const { setOrgDomains } = loginSlice.actions;
/**
 * @param {Array} params - The array of domains that every organs may have.
 */
const setOrgDomainsAction = (params) => (dispatch) => {
  dispatch(setOrgDomains(params));
};
export default setOrgDomainsAction;

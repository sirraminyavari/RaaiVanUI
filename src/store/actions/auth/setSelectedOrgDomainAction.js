/**
 * An action for setting domains of organs to Redux state
 */
import { loginSlice } from 'store/reducers/loginReducer';

const { setSelectedOrgDomain } = loginSlice.actions;
/**
 * @param {Array} params - The array of domains that every organs may have.
 */
const setSelectedOrgDomainAction = (params) => (dispatch) => {
  dispatch(setSelectedOrgDomain(params));
};
export default setSelectedOrgDomainAction;

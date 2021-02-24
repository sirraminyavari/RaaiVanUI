/**
 * An action for setting domains of organizations to Redux state
 */
import { loginSlice } from 'store/reducers/loginReducer';

const { setSelectedOrgDomain } = loginSlice.actions;
/**
 * @param {Array} params - The array of domains that every organization may have.
 */
const setSelectedOrgDomainAction = (params) => (dispatch) => {
  dispatch(setSelectedOrgDomain(params));
};
export default setSelectedOrgDomainAction;

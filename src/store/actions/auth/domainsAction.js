import { decode } from 'js-base64';
import { domainsSlice } from 'store/reducers/domainsReducer';
import APIHandler from '../../../apiHelper/APIHandler';

const {
  getDomainsAction,
  getDomainsResponse,
  getDomainsFailed,
} = domainsSlice.actions;
const apiHandler = new APIHandler('RVAPI', 'GetDomains');

const getDomains = () => async (dispatch) => {
  dispatch(getDomainsAction());
  try {
    apiHandler.fetch(
      {
        ParseResults: true,
      },
      (r) => {
        for (var i = 0, lnt = (r.Domains || []).length; i < lnt; ++i) {
          r.Domains[i].Value = decode(r.Domains[i].Value);
          r.Domains[i].Text = decode(r.Domains[i].Text);
        }

        dispatch(getDomainsResponse(r.Domains));
      },
      (err) => {
        console.log(err, 'error');

        dispatch(getDomainsFailed(err));
      }
    );
  } catch (err) {
    console.log(err, 'error');

    dispatch(getDomainsFailed(err));
  }
};
export default getDomains;

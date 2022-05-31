import { combineReducers } from 'redux';
import domains from './domainsReducer';
import auth from './loginReducer';
import applications from './applicationsReducer';
import invitations from './invitationsReducer';
//! import reducers here

const VERSION_REDUCER_KEY = 'raaivanVersion';

const rootReducer = combineReducers({
  //! This reducer will be used to store the version.
  [VERSION_REDUCER_KEY]: (state = {}) => state,
  domains,
  auth,
  applications,
  invitations,
  //! add reducers.
});

export default rootReducer;

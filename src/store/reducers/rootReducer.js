import { combineReducers } from 'redux';
import theme from './themeReducer';
import domains from './domainsReducer';
import auth from './loginReducer';
import sidebarItems from './sidebarMenuReducer';
import notifications from './notificationsReducer';
import applications from './applicationsReducer';
import onboarding from './onboardingReducer';
import invitations from './invitationsReducer';
//! import reducers here

const VERSION_REDUCER_KEY = 'raaivanVersion';

const rootReducer = combineReducers({
  //! This reducer will be used to store the version.
  [VERSION_REDUCER_KEY]: (state = {}) => state,
  theme,
  domains,
  auth,
  sidebarItems,
  notifications,
  applications,
  onboarding,
  invitations,
  //! add reducers.
});

export default rootReducer;

import { combineReducers } from 'redux';
import theme from './themeReducer';
import domains from './domainsReducer';
import auth from './loginReducer';
import sidebarItems from './sidebarMenuReducer';
import navbarAlert from './navbarAlertReducer';
import applications from './applicationsReducer';
//import reducers here

const rootReducer = combineReducers({
  theme,
  domains,
  auth,
  sidebarItems,
  navbarAlert,
  applications,
  // add reducers
});

export default rootReducer;

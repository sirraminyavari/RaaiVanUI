import { combineReducers } from 'redux';
import theme from './themeReducer';
import auth from './loginReducer';
import domains from './domainsReducer';
import login from './loginReducer';
import sidebarItems from './sidebarMenuReducer';
//import reducers here

const rootReducer = combineReducers({
  theme,
  auth,
  domains,
  login,
  sidebarItems,
  // add reducers
});

export default rootReducer;

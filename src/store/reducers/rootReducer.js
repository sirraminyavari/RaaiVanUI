import { combineReducers } from 'redux';
import theme from './themeReducer';
import domains from './domainsReducer';
import auth from './loginReducer';
import sidebarItems from './sidebarMenuReducer';
//import reducers here

const rootReducer = combineReducers({
  theme,
  domains,
  auth,
  sidebarItems,
  // add reducers
});

export default rootReducer;

import { combineReducers } from 'redux';
import theme from './themeReducer';
import auth from './loginReducer';
import domains from './domainsReducer';
import loginRoute from './loginRouteReducer';
import login from './loginReducer';
//import reducers here

const rootReducer = combineReducers({
  theme,
  auth,
  domains,
  loginRoute,
  login,
  // add reducers
});

export default rootReducer;

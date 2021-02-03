import { combineReducers } from 'redux';
import theme from './themeReducer';
import auth from './loginReducer';
import domains from './domainsReducer';
import loginRoute from './loginRouteReducer';
import signup from './signupReducer';
//import reducers here

const rootReducer = combineReducers({
  theme,
  auth,
  domains,
  loginRoute,
  signup,
  // add reducers
});

export default rootReducer;

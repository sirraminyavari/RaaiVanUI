import { combineReducers } from 'redux';
import user from './userReducer';
import auth from './loginReducer';
import domains from './domainsReducer';
import loginRoute from './loginRouteReducer';
import signup from './signupReducer';
//import reducers here

const rootReducer = combineReducers({
  user,
  auth,
  domains,
  loginRoute,
  signup,
  // add reducers
});

export default rootReducer;

import { combineReducers } from "redux";
import user from "./userReducer";
//import reducers here

const rootReducer = combineReducers({
  user,
  // add reducers
});

export default rootReducer;

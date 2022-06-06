import { combineReducers } from 'redux';
//! import reducers here

const VERSION_REDUCER_KEY = 'raaivanVersion';

const rootReducer = combineReducers({
  //! This reducer will be used to store the version.
  [VERSION_REDUCER_KEY]: (state = {}) => state,
  //! add reducers.
});

export default rootReducer;

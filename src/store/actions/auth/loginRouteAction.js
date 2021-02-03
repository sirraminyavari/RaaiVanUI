import { loginRouteSlice } from '../../reducers/loginRouteReducer';

const { changeLoginRoute } = loginRouteSlice.actions;

const setLoginRoute = (params) => (dispatch) => {
  dispatch(changeLoginRoute(params));
};
export default setLoginRoute;

import { loginSlice } from 'store/reducers/loginReducer';

const { setAuthUser } = loginSlice.actions;

const setAuthUserAction = (authUser) => async (dispatch) => {
  dispatch(setAuthUser(authUser));
  window.RVGlobal.CurrentUser = authUser;
  window.RVGlobal.CurrentUserID = (authUser || {}).UserID;
};

export default setAuthUserAction;

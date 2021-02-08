import { loginSlice } from 'store/reducers/loginReducer';

const { setPassword } = loginSlice.actions;

const setPasswordAction = (params) => (dispatch) => {
  dispatch(setPassword(params));
};
export default setPasswordAction;

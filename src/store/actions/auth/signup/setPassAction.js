import { signupSlice } from 'store/reducers/signupReducer';

const { _setPassword } = signupSlice.actions;

const setPassword = (params) => (dispatch) => {
  dispatch(_setPassword(params));
};
export default setPassword;

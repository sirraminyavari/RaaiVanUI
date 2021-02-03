import { signupSlice } from 'store/reducers/signupReducer';

const { _setEmail } = signupSlice.actions;

const setEmail = (params) => (dispatch) => {
  dispatch(_setEmail(params));
};
export default setEmail;

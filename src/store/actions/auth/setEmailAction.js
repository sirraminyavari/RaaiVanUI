import { loginSlice } from 'store/reducers/loginReducer';

const { setEmail } = loginSlice.actions;

const setEmailAction = (params) => (dispatch) => {
  dispatch(setEmail(params));
};
export default setEmailAction;

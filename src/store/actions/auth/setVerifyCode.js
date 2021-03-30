/**
 * An action for setting verification code to Redux state
 */
import { loginSlice } from 'store/reducers/loginReducer';
import signupAction from './signupAction';

const { setVerifyCode } = loginSlice.actions;

/**
 * This action is connected to 'onChange' callback of input.
 * By typing the user, the Redux state will update synchronously.
 * @param {Array<String>} params - An verification code that user is typing.
 */
const setVerifyCodeAction = (params) => (dispatch, getState) => {
  // As for every verification code char, there is a single input cell,
  // so verificaton code is setted in type of array.
  const state = getState();
  const previous =
    state.auth.verifyCode.length === 0 ? params : state.auth.verifyCode;
  dispatch(setVerifyCode({ new: params }));
  if (!params.find((x) => x === -1)) {
    console.log(params, 'verify code');
    // dispatch(signupAction());
  }
};
export default setVerifyCodeAction;

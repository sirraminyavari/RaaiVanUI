import { loginSlice } from '../../reducers/loginReducer';
import APIHandler from 'apiHelper/APIHandler';

const { logoutSuccess } = loginSlice.actions;
const logoutHandler = new APIHandler('RVAPI', 'Logout');

const logoutAction = () => async (dispatch) => {
  try {
    logoutHandler.fetch(
      {},
      () => {
        dispatch(logoutSuccess());
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};

export default logoutAction;

import { loginSlice } from 'store/reducers/loginReducer';
import { themeSlice } from 'store/reducers/themeReducer';
import { ApplicationsSlice } from 'store/reducers/applicationsReducer';
import APIHandler from 'apiHelper/APIHandler';

const { logoutSuccess } = loginSlice.actions;
const { setSelectedTeam } = themeSlice.actions;
const { clearApplications } = ApplicationsSlice.actions;
const logoutHandler = new APIHandler('RVAPI', 'Logout');

const logoutAction = () => async (dispatch) => {
  try {
    logoutHandler.fetch(
      {},
      () => {
        dispatch(logoutSuccess());
        dispatch(setSelectedTeam(null));
        dispatch(clearApplications());
        delete window.RVGlobal.ApplicationID;
        delete window.RVGlobal.CurrentUser;
        delete window.RVGlobal.CurrentUserID;
      },
      (error) => console.log({ error })
    );
  } catch (err) {
    console.log({ err });
  }
};

export default logoutAction;

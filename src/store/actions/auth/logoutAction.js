import { loginSlice } from 'store/reducers/loginReducer';
import { ApplicationsSlice } from 'store/reducers/applicationsReducer';
import APIHandler from 'apiHelper/APIHandler';
import { useThemeSlice } from 'store/slice/theme';

const { logoutSuccess } = loginSlice.actions;
const { clearApplications } = ApplicationsSlice.actions;
const logoutHandler = new APIHandler('RVAPI', 'Logout');

const logoutAction = (done, error) => async (dispatch) => {
  const {
    actions: { setSelectedTeam },
  } = useThemeSlice();

  try {
    logoutHandler.fetch(
      {},
      () => {
        done && done();
        dispatch(logoutSuccess());
        dispatch(setSelectedTeam(null));
        dispatch(clearApplications());
        delete window.RVGlobal.ApplicationID;
        delete window.RVGlobal.CurrentUser;
        delete window.RVGlobal.CurrentUserID;
      },
      (err) => {
        error && error(err);
        console.log({ err });
      }
    );
  } catch (err) {
    error && error(err);
    console.log({ err });
  }
};

export default logoutAction;

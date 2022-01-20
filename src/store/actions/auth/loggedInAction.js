/**
 * A step after  the successful login.
 */
import { loginSlice } from '../../reducers/loginReducer';
import { decode } from 'js-base64';
import afterLogin from 'utils/OnboardingRoute/afterLogin';

const { loginSuccess, showLastLogins } = loginSlice.actions;
const { GlobalUtilities, RVDic, RVGlobal } = window;

/**
 * After successful login, this action will be called to completing the signing-in process.
 * @param {Object} result - The response of backend after successful login.
 */
const loggedInAction = (result) => (dispatch, getState) => {
  const { auth } = getState();
  const { AuthCookie } = result;

  // The following steps are necessary to be done
  window.IsAuthenticated = true;
  if (RVGlobal) RVGlobal.IsAuthenticated = true;

  // It's needed for pure js, maybe removed in future.
  const callback = async () => {
    const afterLoginResult = await afterLogin(result);

    window.location.href =
      afterLoginResult || auth.Options.ReturnURL || window.location.href;
  };

  let msg = result.LoginMessage ? decode(result.LoginMessage) : null;

  if (auth?.Options?.ReloadAfterLogin) {
    msg =
      (msg || RVDic.MSG.LoggedInSuccessfully) +
      '. ' +
      RVDic.Confirms.DoYouWantToRefreshThePage;
    GlobalUtilities.confirm(msg, function (r) {
      if (r) callback();
    });
  } else {
    if ((result?.LastLogins || []).length > 0)
      dispatch(showLastLogins({ message: msg, lastLogins: result.LastLogins }));
    else if (msg) alert(msg, { autoClose: 10000 }, callback);
    else callback();
  }

  dispatch(loginSuccess(result));
};

export default loggedInAction;

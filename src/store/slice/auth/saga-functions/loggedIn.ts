import { put, select } from 'redux-saga/effects';
import { authActions as actions } from '../';
import { PayloadAction } from '@reduxjs/toolkit';
import { selectAuthSlice } from '../selectors';
import afterLogin from 'utils/OnboardingRoute/afterLogin';
import { decodeBase64 } from 'helpers/helpers';

const { GlobalUtilities, RVDic, RVGlobal } = window;

// It's needed for pure js, maybe removed in future.
const callback = async (result, returnUrl) => {
  const afterLoginResult = await afterLogin(result);

  window.location.href = afterLoginResult || returnUrl || window.location.href;
};

const confirm = (result, returnUrl, msg) => {
  return new Promise((resolve) => {
    GlobalUtilities.confirm(msg, function (r) {
      if (r) callback(result, returnUrl).then(() => resolve({}));
      else resolve({});
    });
  });
};

export function* loggedIn(values: PayloadAction<any>) {
  const result = values.payload || {};

  // The following steps are necessary to be done
  window.IsAuthenticated = true;
  if (RVGlobal) RVGlobal.IsAuthenticated = true;

  let msg = result.LoginMessage ? decodeBase64(result.LoginMessage) : null;

  const {
    options: { reloadAfterLogin, returnUrl },
  } = yield select(selectAuthSlice);

  if (reloadAfterLogin) {
    msg =
      (msg || RVDic.MSG.LoggedInSuccessfully) +
      '. ' +
      RVDic.Confirms.DoYouWantToRefreshThePage;
    yield confirm(result, returnUrl, msg);
  } else {
    if ((result?.LastLogins || []).length > 0)
      yield put(
        actions.showLastLogins({
          message: msg,
          lastLogins: result.LastLogins,
        })
      );
    //else if (msg) alert(msg, { autoClose: 10000 }, callback);
    else if (msg) alert(msg);
    else yield callback(result, returnUrl);
  }

  yield put(actions.loginSuccess(result));
}

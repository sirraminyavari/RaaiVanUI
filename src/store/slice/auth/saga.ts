import { call, put, takeLatest } from 'redux-saga/effects';
import { authActions as actions } from '.';
import API from 'apiHelper';
import { PayloadAction } from '@reduxjs/toolkit';
import { login } from './saga-functions/login';
import { loginStepTwo } from './saga-functions/loginStepTwo';
import { loggedIn } from './saga-functions/loggedIn';
import { SIGN_UP_EMAIL } from 'constant/LoginRoutes';
import { applicationActions } from '../applications';
import { themeActions } from '../theme';
import { IReduxActionCall } from '../types';
import { decodeBase64 } from 'helpers/helpers';

function* logout(values: PayloadAction<IReduxActionCall>) {
  const { done, error } = values.payload || {};

  const res = yield call(API.RV.logout);

  if (res?.ErrorText) error && error();
  else {
    yield put(actions.logoutSuccess());
    yield put(themeActions.setSelectedTeam(null));
    yield put(applicationActions.clearApplications());

    done && done();
    delete window.RVGlobal.ApplicationID;
    delete window.RVGlobal.CurrentUser;
    delete window.RVGlobal.CurrentUserID;
  }
}

function* getDomains(values: PayloadAction<IReduxActionCall>) {
  const res = yield call(API.RV.getDomains);

  yield put(
    actions.getDomainsResponse(
      (res?.Domains || []).map((d) => ({
        ...d,
        Value: decodeBase64(d.Value),
        Text: decodeBase64(d.Text),
      }))
    )
  );
}

function* signupLoadFiles(values: PayloadAction<{ destination: string }>) {
  try {
    const { destination } = values.payload || {};

    yield put(actions.setLoginRoute({ destination: SIGN_UP_EMAIL }));
    yield put(actions.setPassword(''));
    yield put(
      actions.signupLoadFilesSuccess({
        destination,
      })
    );
  } catch (err) {
    yield put(actions.signupLoadFilesFailed(err));
  }
}

function* setLoginRoute(values: PayloadAction<{ destination: string }>) {
  yield put(actions.resetAllErrors());
}

export function* authSaga() {
  yield takeLatest(actions.login.type, login);
  yield takeLatest(actions.loginStepTwo.type, loginStepTwo);
  yield takeLatest(actions.loggedIn.type, loggedIn);
  yield takeLatest(actions.logout.type, logout);
  yield takeLatest(actions.getDomains.type, getDomains);
  yield takeLatest(actions.signupLoadFiles.type, signupLoadFiles);
  yield takeLatest(actions.setLoginRoute.type, setLoginRoute);
}

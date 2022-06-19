import { call, put, select } from 'redux-saga/effects';
import { authActions as actions } from '../';
import API from 'apiHelper';
import { PayloadAction } from '@reduxjs/toolkit';
import { ILoginRequest } from '../types';
import { selectAuthSlice } from '../selectors';
import afterLogin from 'utils/OnboardingRoute/afterLogin';

export function* login(values: PayloadAction<ILoginRequest>) {
  const { Username, Password, InvitationID } = values.payload || {};

  const {
    orgDomains,
    selectedDomain,
    options: { useCaptcha },
  } = yield select(selectAuthSlice);

  if (Username && Password && (!orgDomains?.length || !!selectedDomain)) {
    yield put(actions.loginStart());

    const res = yield call(API.RV.login, {
      Username,
      Password,
      InvitationID,
    });

    const { Succeed, AuthCookie } = res || {};
    const { RVDic } = window;

    if (res?.ErrorText) {
      yield put(
        actions.loginFailed(
          (RVDic.MSG[res?.ErrorText] || res?.ErrorText).replace(
            '[n]',
            res?.RemainingLockoutTime || ' '
          )
        )
      );

      if (!!res?.ErrorText?.TwoStepAuthentication)
        yield put(actions.loginStepTwo(res?.ErrorText?.Data || {}));
      else {
        const needsCaptcha =
          Username.toLowerCase() === 'admin' &&
          !!res?.RemainingLockoutTime &&
          !useCaptcha;

        let err = (RVDic.MSG[res?.ErrorText] || res?.ErrorText).replace(
          '[n]',
          res?.RemainingLockoutTime || ''
        );

        if (needsCaptcha) {
          err = RVDic.Checks.PleaseEnterTheCaptcha;
          // that.init_captcha();
        }
      }
    } else if (!!Succeed && !!AuthCookie) {
      yield put(actions.loggedIn(res));
      yield put(actions.setAuthUser(res?.User || {}));

      window.RVGlobal.IsAuthenticated = true;
      const afterLoginResult = yield afterLogin(res);

      window.location.href = afterLoginResult || '/workspaces';
    }
  } else {
    if (!Username) yield put(actions.setEmailError('ایمیل نمیتواند خالی باشد'));

    if (!Password)
      yield put(actions.setPasswordError('رمز عبور نمیتواند خالی باشد'));

    if (orgDomains.length > 1 && !selectedDomain)
      yield put(actions.setOrgDomainsError('یک دامنه را باید انتخاب کنید'));
  }
}

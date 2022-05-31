import { put, select } from 'redux-saga/effects';
import { authActions as actions } from '../';
import API from 'apiHelper';
import { PayloadAction } from '@reduxjs/toolkit';
import { selectAuthSlice } from '../selectors';

const { GlobalUtilities, RVDic } = window;

const dialog = (data: any, invitationId?: string) => {
  return new Promise((resolve) => {
    const vcd = GlobalUtilities.verification_code_dialog(data, {
      Message: RVDic.MSG.AnAuthenticationCodeHasBeenSentToYourNWithValueM,
      HideCancelButton: true,
      Callback: async function (d, done) {
        if (!d) resolve({});

        const res = await API.RV.loginStepTwo({
          Token: d.Token,
          Code: d.Code,
          InvitationID: invitationId,
        });

        if (res?.ErrorText) {
          alert(RVDic.MSG[res?.ErrorText] || res?.ErrorText);
          done(false);
          if (res?.CodeDisposed) vcd.Close();
        } else if (res?.Succeed) done(true);

        resolve(res);
      },
    });
  });
};

export function* loginStepTwo(values: PayloadAction<any>) {
  const data = values.payload;

  const {
    objects: { invitationId },
  } = yield select(selectAuthSlice);

  const res = yield dialog(data, invitationId);

  if (res?.ErrorText) {
    yield put(actions.setPassword(''));
    yield put(actions.setEmail(''));
  } else if (res?.Succeed) yield put(actions.loggedIn(res));
}

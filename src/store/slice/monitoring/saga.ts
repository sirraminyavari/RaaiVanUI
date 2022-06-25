import { call, put, takeLatest } from 'redux-saga/effects';
import { monitoringActions as actions } from '.';
import API from 'apiHelper';
import { PayloadAction } from '@reduxjs/toolkit';

function* getApplicationsMonitoring(values: PayloadAction<any>) {
  yield put(actions.setFetchingApps(true));
  const res = yield call(API.RV.getApplicationsMonitoring, {
    TotalUsersCount: true,
    MembersCount: true,
    LastActivityTime: true,
    LoginsCountSinceNDaysAgo: 30,
    Count: 20,
    LowerBoundary: 1,
  });
  yield put(actions.setMonitoring(res?.Applications || []));
  yield put(actions.setFetchingApps(false));
}

export function* monitoringSaga() {
  yield takeLatest(
    actions.getApplicationsMonitoring.type,
    getApplicationsMonitoring
  );
}

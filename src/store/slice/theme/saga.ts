import { call, put, takeLatest } from 'redux-saga/effects';
import { themeActions as actions } from '.';
import API from 'apiHelper';

/**
 * @description A function (action) that gets all themes from server.
 * @returns -Dispatch to redux store.
 */
function* getThemes() {
  const res = yield call(API.RV.getThemes);
  yield put(actions.setTheme(res?.Themes));
}

/**
 * @description A function (action) that gets current theme from server.
 * @returns -Dispatch to redux store.
 */
function* getCurrentTheme() {
  const res = yield call(API.Users.getCurrentTheme);
  yield put(actions.setTheme(res?.Theme));
}

export function* themeSaga() {
  yield takeLatest(actions.getThemes.type, getThemes);
  yield takeLatest(actions.getCurrentTheme.type, getCurrentTheme);
}

import { put, takeLatest } from 'redux-saga/effects';
import { themeActions as actions } from '.';
import { getThemes as getThemesApi } from 'apiHelper/ApiHandlers/RVApi';
import { getCurrentTheme as getThemeApi } from 'apiHelper/ApiHandlers/usersApi';

/**
 * @description A function (action) that gets all themes from server.
 * @returns -Dispatch to redux store.
 */
function* getThemes() {
  const res = yield getThemesApi();
  yield put(actions.setThemes(res?.Themes));
}

/**
 * @description A function (action) that gets current theme from server.
 * @returns -Dispatch to redux store.
 */
function* getCurrentTheme() {
  const res = yield getThemeApi();
  yield put(actions.setTheme(res?.Theme));
}

export function* themeSaga() {
  yield takeLatest(actions.getThemes.type, getThemes);
  yield takeLatest(actions.getCurrentTheme.type, getCurrentTheme);
}

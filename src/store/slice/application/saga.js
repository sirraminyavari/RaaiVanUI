import { put, select, takeEvery } from 'redux-saga/effects';
import { applicationActions as actions } from '.';
import { onboardingActions } from '../onboarding';
import {
  selectApplication as selectApplicationApi,
  createApplication as createApplicationApi,
  modifyApplication as modifyApplicationApi,
  getApplications as getApplicationsApi,
  removeApplication as removeApplicationApi,
  recoverApplication as recoverApplicationApi,
} from 'apiHelper/ApiHandlers/RVApi';
import { setRVGlobal } from 'helpers/helpers';
import { selectApplicationSlice } from './selectors';
import { CLASSES_PATH, HOME_PATH } from 'constant/constants';

function* getApplications() {
  const res = yield getApplicationsApi({ Archive: false });
  yield put(res?.Applications || []);
  yield put(actions.getArchivedApplications());
  yield put(actions.setFetchingApps(false));
}

function* getArchivedApplications() {
  const res = yield getApplicationsApi({ Archive: true });
  yield put(actions.setArchivedApplications(res?.Applications || []));
}

function* removeApplication(values) {
  const { error, done, ApplicationID } = values?.payload || {};

  const appState = yield select(selectApplicationSlice);

  const newApps = (appState?.userApps || []).filter(
    (app) => app.ApplicationID !== ApplicationID
  );

  const res = yield removeApplicationApi({ ApplicationID });

  if (res?.ErrorText) {
    error && error(res?.ErrorText);
  } else if (res?.Succeed) {
    done && done(ApplicationID);
    yield put(actions.removeApplicationSuccessful(newApps));
    yield put(actions.setApplicationsOrder(newApps));
    yield put(actions.getArchivedApplications());
  }
}

function* recoverApplication(values) {
  const { error, done, ApplicationID } = values?.payload || {};

  const appState = yield select(selectApplicationSlice);

  const newArchivedApps = (appState?.userArchivedApps || []).filter(
    (app) => app.ApplicationID !== ApplicationID
  );

  const res = yield recoverApplicationApi({ ApplicationID });

  if (res?.ErrorText) {
    error && error(res?.ErrorText);
  } else if (res?.Succeed) {
    done && done(res);
    yield put(actions.setArchivedApplications(newArchivedApps));
  }
}

function* createApplication(values) {
  const { error, done } = values?.payload || {};

  const appState = yield select(selectApplicationSlice);

  const res = yield createApplicationApi(values?.payload);

  if (res?.ErrorText) {
    error && error(res?.ErrorText);
  } else if (res?.Succeed) {
    done && done(res);
    const createdApp = res?.Application;
    const appUsers = res?.ApplicationUsers;
    createdApp.Users = appUsers;
    const newApps = [...appState.userApps, createdApp];
    yield put(actions.addApplication(newApps));
    yield put(actions.setApplicationsOrder(newApps));
  }
}

function* modifyApplication(values) {
  const { ApplicationID, Title, error, done } = values?.payload || {};

  const res = yield modifyApplicationApi({ ApplicationID, Title });

  if (res?.ErrorText) {
    error && error(res?.ErrorText);
  } else if (res?.Succeed) {
    done && done(res);
    yield put(actions.getApplications());
  }
}

function* selectApplication(values) {
  const { ApplicationID, error, done } = values?.payload || {};

  yield put(
    actions.setSelectingApp({
      isSelecting: true,
      selectingAppId: ApplicationID,
    })
  );

  const res = yield selectApplicationApi({ ApplicationID });

  if (res?.ErrorText) {
    error && error(res?.ErrorText);
  } else if (res?.Succeed) {
    setRVGlobal({
      ApplicationID,
      IsSystemAdmin: !!res?.IsSystemAdmin,
    });

    dispatch(getSidebarNodeTypes());
    dispatch(getConfigPanels());
    dispatch(getUnderMenuPermissions(['Reports']));

    if (!!res?.ProductTour) {
      yield put(onboardingActions.onboardingName(res?.ProductTour?.Name || ''));
      yield put(onboardingActions.onboardingStep(res?.ProductTour?.Step || 0));

      if (res?.ProductTour?.Name) {
        yield put(onboardingActions.toggleActivation());
      }
      done && done(CLASSES_PATH);
    } else {
      done && done(HOME_PATH);
    }
  }

  yield put(
    actions.setSelectingApp({
      isSelecting: false,
      selectingAppId: null,
    })
  );
}

export function* applicationSaga() {
  yield takeEvery(actions.getApplications.type, getApplications);
  yield takeEvery(
    actions.getArchivedApplications.type,
    getArchivedApplications
  );
  yield takeEvery(actions.removeApplication.type, removeApplication);
  yield takeEvery(actions.recoverApplication.type, recoverApplication);
  yield takeEvery(actions.createApplication.type, createApplication);
  yield takeEvery(actions.modifyApplication.type, modifyApplication);
  yield takeEvery(actions.selectApplication.type, selectApplication);
}

import { put, select, takeEvery } from 'redux-saga/effects';
import { applicationActions as actions } from '.';
import { onboardingActions } from '../onboarding';
import API from 'apiHelper';
import { setRVGlobal } from 'helpers/helpers';
import { selectApplicationSlice } from './selectors';
import { CLASSES_PATH, HOME_PATH } from 'constant/constants';
import { PayloadAction } from '@reduxjs/toolkit';
import {
  IAppID,
  IAppIDs,
  IAppIDTitle,
  IAppIDUserID,
  IWorkspaceIDTitle,
} from './types';

function* getApplications() {
  const res = yield API.RV.getApplications({ Archive: false });
  yield put(res?.Applications || []);
  yield put(actions.getArchivedApplications({}));
  yield put(actions.setFetchingApps(false));
}

function* getArchivedApplications() {
  const res = yield API.RV.getApplications({ Archive: true });
  yield put(actions.setArchivedApplications(res?.Applications || []));
}

function* removeApplication(values: PayloadAction<IAppID>) {
  const { error, done, ApplicationID } = values?.payload || {};

  const appState = yield select(selectApplicationSlice);

  const newApps = (appState?.userApps || []).filter(
    (app) => app.ApplicationID !== ApplicationID
  );

  const res = yield API.RV.removeApplication({
    ApplicationID: ApplicationID,
  });

  if (res?.ErrorText) {
    error && error(res?.ErrorText);
  } else if (res?.Succeed) {
    done && done(ApplicationID);
    yield put(actions.removeApplicationSuccessful(newApps));
    yield put(actions.setApplicationsOrder(newApps));
    yield put(actions.getArchivedApplications({}));
  }
}

function* recoverApplication(values: PayloadAction<IAppID>) {
  const { error, done, ApplicationID } = values?.payload || {};

  const appState = yield select(selectApplicationSlice);

  const newArchivedApps = (appState?.userArchivedApps || []).filter(
    (app) => app.ApplicationID !== ApplicationID
  );

  const res = yield API.RV.recoverApplication({
    ApplicationID: ApplicationID,
  });

  if (res?.ErrorText) {
    error && error(res?.ErrorText);
  } else if (res?.Succeed) {
    done && done(res);
    yield put(actions.setArchivedApplications(newArchivedApps));
  }
}

function* createApplication(values: PayloadAction<IWorkspaceIDTitle>) {
  const { WorkspaceID, Title, error, done } = values?.payload || {};

  const appState = yield select(selectApplicationSlice);

  const res = yield API.RV.createApplication({ WorkspaceID, Title });

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

function* modifyApplication(values: PayloadAction<IAppIDTitle>) {
  const { ApplicationID, Title, error, done } = values?.payload || {};

  const res = yield API.RV.modifyApplication({ ApplicationID, Title });

  if (res?.ErrorText) {
    error && error(res?.ErrorText);
  } else if (res?.Succeed) {
    done && done(res);
    yield put(actions.getApplications({}));
  }
}

function* selectApplication(values: PayloadAction<IAppID>) {
  const { ApplicationID, error, done } = values?.payload || {};

  yield put(
    actions.setSelectingApp({
      isSelecting: true,
      selectingAppId: ApplicationID,
    })
  );

  const res = yield API.RV.selectApplication({ ApplicationID });

  if (res?.ErrorText) {
    error && error(res?.ErrorText);
  } else if (res?.Succeed) {
    setRVGlobal({
      ApplicationID,
      IsSystemAdmin: !!res?.IsSystemAdmin,
    });

    yield put(onboardingActions.getSidebarNodeTypes({}));
    yield put(onboardingActions.getConfigPanels({}));
    yield put(onboardingActions.getUnderMenuPermissions(['Reports']));

    if (!!res?.ProductTour) {
      yield put(onboardingActions.onboardingName(res?.ProductTour?.Name || ''));
      yield put(onboardingActions.onboardingStep(res?.ProductTour?.Step || 0));

      if (res?.ProductTour?.Name) {
        yield put(onboardingActions.toggleActivation({}));
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

function* unsubscribeFromApplication(values: PayloadAction<IAppID>) {
  const { ApplicationID, error, done } = values?.payload || {};

  const res = yield API.RV.unsubscribeFromApplication({
    ApplicationID: ApplicationID,
  });

  if (res?.ErrorText) {
    error && error(res?.ErrorText);
  } else if (res?.Succeed) {
    done && done(res);
    yield put(actions.getApplications({}));
  }
}

function* removeUserFromApplication(values: PayloadAction<IAppIDUserID>) {
  const { ApplicationID, UserID, error, done } = values?.payload || {};

  const res = yield API.RV.removeUserFromApplication({
    ApplicationID: ApplicationID,
    UserID: UserID,
  });

  if (res?.ErrorText) {
    error && error(res?.ErrorText);
  } else if (res?.Succeed) {
    done && done(res);
    yield put(actions.getApplications({}));
  }
}

function* getApplicationsOrder(
  values: PayloadAction<{ UnorderedApplications: any[] }>
) {
  const { UnorderedApplications: Apps } = values.payload;

  const ordered: string[] = yield API.RV.getApplicationsOrder();

  yield put(actions.setFetchingApps(false));

  const orderedApps = ordered
    .filter((id) => Apps.some((app) => app?.ApplicationID === id))
    .map((id) => Apps.filter((app) => app.ApplicationID === id)[0]);

  const extraApps = Apps.filter(
    (app) => !ordered.some((id) => app.ApplicationID === id)
  );

  yield put(actions.setApplications([...orderedApps, ...extraApps]));
}

function* setApplicationsOrder(values: PayloadAction<IAppIDs>) {
  const { ApplicationIDs, done, error } = values.payload;
  const res: any = yield API.RV.setApplicationsOrder({ ApplicationIDs });

  if (res?.Succeed) done && done();
  else error && error();
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
  yield takeEvery(
    actions.unsubscribeFromApplication.type,
    unsubscribeFromApplication
  );
  yield takeEvery(
    actions.removeUserFromApplication.type,
    removeUserFromApplication
  );
  yield takeEvery(actions.getApplicationsOrder.type, getApplicationsOrder);
  yield takeEvery(actions.setApplicationsOrder.type, setApplicationsOrder);
}

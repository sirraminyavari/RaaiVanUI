import { call, put, takeLatest, select } from 'redux-saga/effects';
import { onboardingActions as actions } from '.';
import { themeActions } from '../theme';
import { applicationActions } from '../applications';
import API from 'apiHelper';
import { PayloadAction } from '@reduxjs/toolkit';
import { ISetFieldOfExpertiseRequest } from './types';
import { MAIN_CONTENT, SETT_ONBOARDING_CONTENT } from 'constant/constants';
import { selectOnboardingSlice } from './selectors';

function* setTeamName(
  values: PayloadAction<{ WorkspaceID?: string; TeamName: string }>
) {
  const { WorkspaceID, TeamName } = values.payload;

  let wsId = WorkspaceID;

  if (!!WorkspaceID) yield put(actions.setOnboardingProductTourStatus(false));
  else {
    const res = yield call(API.RV.createWorkspace, {
      Name: window.RVDic.Default,
    });
    wsId = res?.Workspace?.WorkspaceID;
  }

  if (wsId) {
    const res = yield call(API.RV.createApplication, {
      WorkspaceID: wsId,
      Title: TeamName,
    });

    if (res?.Succeed) {
      yield put(actions.setOnboardingTeamName(TeamName));

      yield put(
        themeActions.setSidebarContent({
          current: SETT_ONBOARDING_CONTENT,
          prev: MAIN_CONTENT,
        })
      );
    }
  }
}

const serverValue = {
  lessThan10: '1 - 10',
  between11To20: '10 - 20',
  moreThan20: 'more than 20',
};

function* setTeamSize(
  values: PayloadAction<{ ApplicationID: string; Size: string }>
) {
  const { ApplicationID, Size } = values.payload;

  yield call(API.RV.setApplicationSize, {
    ApplicationID,
    Size: serverValue[Size],
  });

  const res = yield call(API.RV.selectApplication, { ApplicationID });

  yield put(
    actions.setTeamSizeSuccessful({
      ApplicationID,
      IsSystemAdmin: res?.IsSystemAdmin === true,
    })
  );
}

function* setFieldOfExpertise(
  values: PayloadAction<ISetFieldOfExpertiseRequest>
) {
  const {
    applicationId,
    teamName,
    showProductTour,
    fieldOfExpertise: { id: fieldId, name: fieldName },
  } = values.payload;

  yield call(API.RV.setApplicationFieldOfExpertise, {
    ApplicationID: applicationId,
    FieldID: fieldId,
    FieldName: fieldName,
  });

  yield put(
    applicationActions.selectApplication({
      ApplicationID: applicationId,
    })
  );

  if (showProductTour) {
    yield put(actions.onboardingName('intro'));
    yield put(actions.onboardingStep(0));
  }

  yield put(
    themeActions.setSelectedTeam({ name: teamName, id: applicationId })
  );
}

function* goToNextOnboardingStep() {
  const state = yield select(selectOnboardingSlice);

  yield put(actions.setLoading(true));

  switch (state.apiName) {
    case 'fieldOfExpertise':
      const { fieldID, fieldName } = state.teamState.workField;

      if (fieldID !== 'OTHERS' || !!fieldName) {
        yield put(
          actions.setFieldOfExpertise({
            applicationId: state.applicationID,
            teamName: state.teamState.teamName,
            fieldOfExpertise: {
              id: fieldID === 'OTHERS' ? undefined : fieldID,
              name: fieldName,
            },
          })
        );
      }
      break;
    case 'teamSize':
      yield put(
        actions.setTeamSize({
          ApplicationID: state.applicationID,
          Size: state.teamState.peopleCount,
        })
      );
      break;
    case 'teamName':
      yield put(
        actions.setTeamName({
          WorkspaceID: state.WorkspaceID,
          TeamName: state.teamState.teamName,
        })
      );
      break;
  }

  yield put(state.nextStepAction || actions.teamSetName);
}

export function* notificationsSaga() {
  yield takeLatest(actions.setTeamName.type, setTeamName);
  yield takeLatest(actions.setTeamSize.type, setTeamSize);
  yield takeLatest(actions.setFieldOfExpertise.type, setFieldOfExpertise);
  yield takeLatest(actions.goToNextOnboardingStep.type, goToNextOnboardingStep);
}

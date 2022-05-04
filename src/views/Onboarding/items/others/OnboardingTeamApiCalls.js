import {
  createApplication,
  createWorkspace,
  selectApplication,
  setApplicationFieldOfExpertise,
  setApplicationSize,
} from 'apiHelper/ApiHandlers/RVApi';
import { themeSlice } from 'store/reducers/themeReducer';
import { OnboardingTeamStepContextActions } from './OnboardingTeam.context';
import { store } from 'store/store';
import { MAIN_CONTENT, SETT_ONBOARDING_CONTENT } from 'constant/constants';
import { selectApplication as selectApplicationAction } from 'store/actions/applications/ApplicationsAction';
import { setOnboardingTeamName } from 'store/reducers/onboardingReducer';
const { setSidebarContent } = themeSlice.actions;

const { setSelectedTeam } = themeSlice.actions;

export const onboardingTeamNameSave = async ({ dispatch, teamName }) => {
  const createWorkspaceResponse = await createWorkspace({
    Name: window.RVDic.Default,
  });
  let createApplicationResponse;

  if (createWorkspaceResponse.Workspace?.WorkspaceID) {
    createApplicationResponse = await createApplication({
      WorkspaceID: createWorkspaceResponse.Workspace.WorkspaceID,
      Title: teamName,
    });
  }

  if (createApplicationResponse?.Succeed) {
    store.dispatch(setOnboardingTeamName(teamName));
    store.dispatch(
      setSidebarContent({
        current: SETT_ONBOARDING_CONTENT,
        prev: MAIN_CONTENT,
      })
    );

    dispatch({
      type: OnboardingTeamStepContextActions.ONBOARDING_TEAM_SET_APPLICATION_ID,
      stateKey: 'ApplicationID',
      stateValue: createApplicationResponse.Application.ApplicationID,
    });
  }
};

export const onboardingTeamPeopleCountSave = async ({
  //   dispatch,
  ApplicationID,
  Size,
}) => {
  const serverValue = {
    lessThan10: '1 - 10',
    between11To20: '10 - 20',
    moreThan20: 'more than 20',
  };
  await setApplicationSize({
    ApplicationID,
    Size: serverValue[Size],
  });

  const selectApplicationResponse = await selectApplication({
    ApplicationID: ApplicationID,
  });

  (window.RVGlobal || {}).ApplicationID = ApplicationID;
  (window.RVGlobal || {}).IsSystemAdmin =
    selectApplicationResponse?.IsSystemAdmin;
};

export const onboardingTeamFieldOfExpertiseSave = async ({
  // dispatch,
  teamName,
  ApplicationID,
  workFieldID,
  workFieldName,
}) => {
  await setApplicationFieldOfExpertise({
    ApplicationID,
    FieldID: workFieldID,
    FieldName: workFieldName,
  });
  store.dispatch(selectApplicationAction(ApplicationID));
  store.dispatch(setSelectedTeam({ name: teamName, id: ApplicationID }));
};

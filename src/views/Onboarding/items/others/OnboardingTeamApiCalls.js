import {
  createApplication,
  createWorkspace,
  selectApplication,
  setApplicationFieldOfExpertise,
  setApplicationSize,
} from 'apiHelper/ApiHandlers/RVApi';
import { OnboardingTeamStepContextActions } from './OnboardingTeam.context';

//TODO Refactor needed ...
export const onboardingTeamNameSave = async ({ dispatch, teamName }) => {
  const wsRes = await createWorkspace({ Name: window.RVDic.Default });
  let appRes;

  if (wsRes.Workspace?.WorkspaceID) {
    appRes = await createApplication({
      WorkspaceID: wsRes.Workspace.WorkspaceID,
      Title: teamName,
    });
  }

  const slctRes = !appRes?.Application?.ApplicationID
    ? null
    : await selectApplication({
        ApplicationID: appRes.Application.ApplicationID,
      });

  if (slctRes?.Succeed) {
    (window.RVGlobal || {}).ApplicationID = appRes.Application.ApplicationID;
    (window.RVGlobal || {}).IsSystemAdmin = slctRes.IsSystemAdmin;

    dispatch({
      type: OnboardingTeamStepContextActions.ONBOARDING_TEAM_SET_APPLICATION_ID,
      stateKey: 'ApplicationID',
      stateValue: appRes.Application.ApplicationID,
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
};

export const onboardingTeamFieldOfExpertiseSave = async ({
  //   dispatch,
  ApplicationID,
  workFieldID,
  workFieldName,
}) => {
  await setApplicationFieldOfExpertise({
    ApplicationID,
    FieldID: workFieldID,
    FieldName: workFieldName,
  });
};

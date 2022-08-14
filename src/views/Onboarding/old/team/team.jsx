import React, { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../context/stepper.context';
import DashedLine from '../dashed.line';
import { useBeforeunload, useOnLoad } from '../hook/hooks';
import { team_on_exit, team_on_start } from '../message';
import './team.css';
import TeamsSlider from './teams.slider';
import APIHandler from 'apiHelper/APIHandler';
import {
  createApplication,
  createWorkspace,
  selectApplication,
} from 'apiHelper/ApiHandlers/RVAPI';
import { decodeBase64 } from 'helpers/helpers';

const { RVDic } = window;

const Team = () => {
  const { info, dispatch } = useContext(StepperContext);
  const [teamsInvitedTo, setTeamsInvitedTo] = useState([]);
  const [name, setName] = useState('');

  useOnLoad(team_on_start);

  useBeforeunload(team_on_exit);

  const saveUserSettingsItem = new APIHandler(
    'UsersAPI',
    'SaveUserSettingsItem'
  );

  const saveName = async () => {
    const wsRes = await createWorkspace({ Name: RVDic.Default });

    const appRes = !wsRes?.Workspace?.WorkspaceID
      ? null
      : await createApplication({
          WorkspaceID: wsRes.Workspace.WorkspaceID,
          Title: name,
        });

    const slctRes = !appRes?.Application?.ApplicationID
      ? null
      : await selectApplication({
          ApplicationID: appRes.Application.ApplicationID,
        });

    if (slctRes?.Succeed) {
      (window.RVGlobal || {}).ApplicationID = appRes.Application.ApplicationID;
      (window.RVGlobal || {}).IsSystemAdmin = slctRes.IsSystemAdmin;

      dispatch({
        type: 'SET_TEAM_NAME',
        teamName: decodeBase64(appRes.Application.Title),
        applicationId: appRes.Application.ApplicationID,
      });
    }
  };

  useEffect(() => {
    new APIHandler('UsersAPI', 'GetCurrentInvitations').fetch({}, (res) => {
      if (!res.NoApplicationFound) {
      }
    });
    saveUserSettingsItem.fetch(
      {
        Name: 'first_team_wizard',
        Value: true,
      },
      (response) => {}
    );
  }, []);

  return (
    <div className="team-page">
      <div className="team-name-selection">
        <div className="h1">{'میخوام اسم تیمم'}</div>
        <div>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            className="input h1"
            style={{ width: '320px' }}
            placeholder="نام تیم"
          />
        </div>
        <div className="h1">{'باشه،'}</div>
      </div>
      <div className="make-team-wrapper">
        <button
          className={[
            'ActionButton',
            'make-team-btn',
            name.length < 3 && 'deactive',
          ].join(' ')}
          onClick={(e) => {
            saveName();
          }}
        >
          {'تیممو بساز!'}
        </button>
      </div>

      {teamsInvitedTo.length !== 0 && (
        <div className="action-seperator">
          <DashedLine width="100%" fill="12px" />
          <h1 style={{ color: '#BAC9DC' }}>یا</h1>
        </div>
      )}

      {teamsInvitedTo.length !== 0 && (
        <div className="team-invitation-block">
          <p>
            از قبل به تیم‌های دیگه‌ای دعوت شدی؛ می‌خوای بدون این که تیمی بسازی
            یه راست ببرمت توی یکی از اونا؟
          </p>

          <TeamsSlider teamsInvitedTo={teamsInvitedTo} />
        </div>
      )}
    </div>
  );
};
export default Team;

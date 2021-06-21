import React, { useContext, useState, useEffect } from 'react';
import { StepperContext } from '../context/stepper.context';
import DashedLine from '../dashed.line';
import { useBeforeunload, useOnLoad } from '../hook/hooks';
import { team_on_exit, team_on_start } from '../message';
import './team.css';
import TeamsSlider from './teams.slider';
import APIHandler from 'apiHelper/APIHandler';
import { encode, decode } from 'js-base64';

const Team = () => {
  const { info, dispatch } = useContext(StepperContext);
  const [teamsInvitedTo, setTeamsInvitedTo] = useState([]);
  const [name, setName] = useState('');

  useOnLoad(team_on_start);

  useBeforeunload(team_on_exit);

  const saveName = () => {
    new APIHandler('RVAPI', 'CreateApplication').fetch(
      {
        Title: encode(name),
      },
      (res) => {
        console.log(res);
        if (res.Application) {
          dispatch({
            type: 'SET_TEAM_NAME',
            teamName: name,
            applicationId: res.Application.ApplicationId,
          });
        }
      }
    );
  };

  useEffect(() => {
    new APIHandler('UsersAPI', 'GetCurrentInvitations').fetch({}, (res) => {
      if (!res.NoApplicationFound) {
      }
    });
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
          onClick={(e) => saveName()}>
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

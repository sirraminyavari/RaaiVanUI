import React, { useContext } from 'react';
import { StepperContext } from '../context/stepper.context';
import DashedLine from '../dashed.line';
import './team.css';
import TeamsSlider from './teams.slider';

const Team = () => {
  const { info, dispatch } = useContext(StepperContext);

  return (
    <div className="team-page">
      <div className="team-name-selection">
        <div className="h1">{'میخوام اسم تیمم'}</div>
        <div>
          <input
            type="text"
            onChange={(e) =>
              dispatch({ type: 'SET_TEAM_NAME', teamName: e.target.value })
            }
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
            info.teamName.length < 3 && 'deactive',
          ].join(' ')}
          onClick={(e) => dispatch({ type: 'NEXT_STEP' })}>
          {'تیممو بساز!'}
        </button>
      </div>

      <div className="action-seperator">
        <DashedLine width="100%" fill="12px" />
        <h1 style={{ color: '#BAC9DC' }}>یا</h1>
      </div>

      <div className="team-invitation-block">
        <p>
          از قبل به تیم‌های دیگه‌ای دعوت شدی؛ می‌خوای بدون این که تیمی بسازی یه
          راست ببرمت توی یکی از اونا؟
        </p>

        <TeamsSlider />
      </div>
    </div>
  );
};
export default Team;

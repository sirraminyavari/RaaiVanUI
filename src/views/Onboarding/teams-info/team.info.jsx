import React, { useContext } from 'react';
import { StepperContext } from '../context/stepper.context';
import Select from './select';
import FieldSelection from './field.selection';
import Option from './option';
import './team.info.css';

const TeamInfo = () => {
  const options = [
    { id: 0, value: '1 - 10' },
    { id: 1, value: '10 - 20' },
    { id: 2, value: 'بیشتر از 20' },
  ];
  const fields = [
    { id: 10, value: 'برنامه نویسی تحت وب' },
    { id: 11, value: 'فنی مهندسی' },
    { id: 22, value: ' طراحی رابط کاربری و تجربه کاربری ' },
  ];
  const { info, dispatch } = useContext(StepperContext);

  const selectMembers = (value) => {
    dispatch({ type: 'SET_TEAM_MEMBERS', members: value });
  };

  const selectField = (value) => {
    dispatch({ type: 'SET_FIELD', field: value });
  };

  return (
    <div>
      <div className="team-name-selection noselect">
        <div className="h3">{`تیم ${info.teamName} از`}</div>
        <div>
          <Select placeholder="تعداد" name="members" value={info.members}>
            {options.map((x) => (
              <Option
                key={x.id}
                id={x.id}
                value={x.value}
                onSelect={selectMembers}>
                {x.value}
              </Option>
            ))}
          </Select>
        </div>
        <div className="h3">{'نفر تشکیل شده،'}</div>
      </div>

      {info.members !== '' && (
        <div className="team-name-selection">
          <div className="h3">{' و حوزه کاری من '}</div>
          <div>
            <FieldSelection
              placeholder="زمینه کاریت چیه؟"
              name="field"
              value={info.field}>
              {fields.map((x) => (
                <Option
                  key={x.id}
                  id={x.id}
                  value={x.value}
                  onSelect={selectField}>
                  {x.value}
                </Option>
              ))}
            </FieldSelection>
          </div>
          <div className="h3">{'هست.'}</div>
        </div>
      )}

      <div className="team-info-action">
        {info.field !== '' && info.members !== '' && (
          <button
            className="ActionButton"
            onClick={() => dispatch({ type: 'NEXT_STEP' })}>
            واسه من چی داری؟
          </button>
        )}
      </div>
    </div>
  );
};
export default TeamInfo;

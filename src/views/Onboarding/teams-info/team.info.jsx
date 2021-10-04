import React, { useContext, useEffect, useState } from 'react';
import { StepperContext } from '../context/stepper.context';
import Select from './select';
import FieldSelection from './field.selection';
import Option from './option';
import './team.info.css';
import APIHandler from 'apiHelper/APIHandler';
import { decode, encode } from 'js-base64';
import { useOnLoad, useBeforeunload } from '../hook/hooks';
import { team_spec_on_start, team_spec_on_exit } from '../message';

const TeamInfo = () => {
  const options = [
    { id: 0, value: '1 - 10', main_value: '1 - 10' },
    { id: 1, value: '10 - 20', main_value: '10 - 20' },
    { id: 2, value: 'بیشتر از 20', main_value: 'more than 20' },
  ];
  const { info, dispatch } = useContext(StepperContext);
  const [fields, setFields] = useState([]);

  useOnLoad(team_spec_on_start);
  useBeforeunload(team_spec_on_exit);

  useEffect(() => {
    new APIHandler('CNAPI', 'GetTemplateTags').fetch({}, (res) => {
      const tags = (res.Tags || []).map((x) => ({
        id: x.NodeID,
        value: decode(x.Name),
      }));
      setFields(tags);
    });
  }, []);

  const selectMembers = ({ value, id }) => {
    let arr = options.filter((op) => op.value === value);
    let saveValue = (arr.length ? arr[0].main_value : null) || value;

    dispatch({ type: 'SET_TEAM_MEMBERS', members: saveValue });
  };

  const selectField = ({ value, id }) => {
    dispatch({ type: 'SET_FIELD', field: { value, id } });
  };

  const save = () => {
    const rvapiSetApplicationSize = new APIHandler(
      'RVAPI',
      'SetApplicationSize'
    );
    const rvapiSetApplicationFieldOfExpertise = new APIHandler(
      'RVAPI',
      'SetApplicationFieldOfExpertise'
    );

    rvapiSetApplicationSize.fetch(
      {
        ApplicationID: info.applicationId,
        Size: encode(info.members),
      },
      (res) => {
        rvapiSetApplicationFieldOfExpertise.fetch(
          {
            ApplicationID: info.applicationId,
            FieldID: info.field.id,
            FieldName: encode(info.field.value),
          },
          (res) => {
            if (!!res.Succeed) {
              dispatch({ type: 'NEXT_STEP' });
            }
          }
        );
      }
    );
  };

  return (
    <div className="team-info-selection-box">
      <div style={{ height: '80px' }}>
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
      </div>

      <div style={{ height: '80px' }}>
        {info.members !== '' && (
          <div className="team-name-selection">
            <div className="h3">{' و حوزه کاری من '}</div>
            <div>
              <FieldSelection
                placeholder="زمینه کاریت چیه؟"
                name="field"
                value={info.field.value}>
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
      </div>

      <div style={{ height: '100px' }}>
        <div className="team-info-action">
          {info.field !== '' && info.members !== '' && (
            <button className="ActionButton" onClick={() => save()}>
              واسه من چی داری؟
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default TeamInfo;

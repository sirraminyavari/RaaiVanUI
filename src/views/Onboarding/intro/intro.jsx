import React, { useContext, useEffect } from 'react';
import Avatar from './avatar';
import { StepperContext } from '../context/stepper.context';
import './intro.css';
import '../styles.css';
import AvatarThumb from './avatar.thumb';
import { encode } from 'js-base64';
import APIHandler from 'apiHelper/APIHandler';
import { intro_on_start, intro_on_exit } from '../message';
import { useBeforeunload, useOnLoad } from '../hook/hooks';
const Intro = (props) => {
  const { info, dispatch } = useContext(StepperContext);

  // log loadin component to server
  useOnLoad(intro_on_start);

  // log exit component to server
  useBeforeunload(intro_on_exit);

  const save = () => {
    new APIHandler('UsersAPI', 'SetFirstAndLastName').fetch(
      {
        FirstName: encode(info.firstName),
        LastName: encode(info.lastName),
      },
      (res) => {
        console.log(res);
        dispatch({ type: 'NEXT_STEP' });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  return (
    <div className="intro-container">
      <div className="intro-wrapper">
        <h1>به کلیک‌مایند خوش اومدی!</h1>
        <p>
          قبل از این که کار با کلیک‌مایند رو شروع کنی لازمه چند تا نکته رو بهت
          بگم و چند تا چیز رو با هم تنظیم کنیم:
        </p>

        <div className="intro-form">
          <div className="avatar-block">
            {info.avatar === undefined && <Avatar></Avatar>}

            {info.avatar !== undefined && (
              <AvatarThumb url={info.avatar}></AvatarThumb>
            )}
          </div>

          <div className="name-block">
            <input
              type="text"
              defaultValue={info.firstName}
              onChange={(e) =>
                dispatch({ type: 'SET_FIRST_NAME', firstName: e.target.value })
              }
              className="rv-input"
              placeholder="نام"
            />
            <input
              type="text"
              defaultValue={info.lastName}
              onChange={(e) =>
                dispatch({ type: 'SET_Last_NAME', lastName: e.target.value })
              }
              className="rv-input"
              placeholder="نام خانوادگی"
            />
          </div>
        </div>

        <div className={'intro-action'}>
          <button
            className={[
              'ActionButton',
              (info.firstName === '' || info.lastName === '') && 'deactive',
            ].join(' ')}
            onClick={() => save()}>
            {'بزن بریم!'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Intro;

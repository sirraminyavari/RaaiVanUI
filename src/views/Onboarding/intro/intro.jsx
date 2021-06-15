import React, { useContext } from 'react';
import Avatar from './avatar';
import { StepperContext } from '../context/stepper.context';
import './intro.css';
import '../styles.css';
import AvatarThumb from './avatar.thumb';

const Intro = (props) => {
  const { info, dispatch } = useContext(StepperContext);

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
            onClick={() => dispatch({ type: 'NEXT_STEP' })}>
            {'بزن بریم!'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Intro;

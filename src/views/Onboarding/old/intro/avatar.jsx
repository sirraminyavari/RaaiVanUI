import React, { useContext, useState } from 'react';
import { StepperContext } from '../context/stepper.context';
import UploadIcon from './upload.icon';

const Avatar = (props) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [uploadBtnColor, setUploadBtnColor] = useState('#bdbdbd');

  const { info, dispatch } = useContext(StepperContext);

  const mouseEnter = () => {
    setMouseIsOver(true);
    setUploadBtnColor('#424242');
  };

  const mouseLeave = () => {
    setMouseIsOver(false);
    setUploadBtnColor('#bdbdbd');
  };

  const avatarText = () =>
    info.firstName === '' && info.lastName === ''
      ? 'آواتار'
      : `${info.firstName.charAt(0)} ${info.lastName.charAt(0)}`;

  return (
    <div className="">
      <div
        className={['avatar', mouseIsOver && 'avatar_hovered'].join(' ')}
        onMouseEnter={() => mouseEnter()}
        onMouseLeave={() => mouseLeave()}
      >
        {avatarText()}
      </div>
      <div
        className={'upload'}
        onMouseEnter={() => mouseEnter()}
        onMouseLeave={() => mouseLeave()}
        onClick={() =>
          dispatch({
            type: 'SET_AVATAR',
            avatar:
              'https://ponisha.ir/usercontent/500281/avatar-e34f2f863290a0251605612a90ae3b94.jpg',
          })
        }
      >
        {false && <UploadIcon color={uploadBtnColor}></UploadIcon>}
      </div>
    </div>
  );
};
export default Avatar;

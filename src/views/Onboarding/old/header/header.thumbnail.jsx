import React from 'react';
import { useContext } from 'react';
import { StepperContext } from '../context/stepper.context';

const HeaderThumbnail = () => {
  const { info, dispatch } = useContext(StepperContext);
  return (
    <div>
      {info.avatar === undefined && (
        <div className="thumb-placeholder">
          {`${info.firstName.charAt(0)} ${info.lastName.charAt(0)}`}
        </div>
      )}

      {info.avatar !== undefined && (
        <img src={info.avatar} className="thumb-img"></img>
      )}
    </div>
  );
};
export default HeaderThumbnail;

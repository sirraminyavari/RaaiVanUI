import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import React from 'react';

const ProfileInfoItem = ({ icon: Icon, text }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '2rem',
        margin: '1rem 0',
      }}>
      <Icon size={18} color={TCV_DEFAULT} />
      <div
        style={{
          margin: '0 1rem',
          flexGrow: 1,
          borderBottom: `1px solid ${CV_DISTANT}`,
          color: CV_DISTANT,
          fontSize: '1rem',
        }}>
        {text}
      </div>
    </div>
  );
};

export default ProfileInfoItem;

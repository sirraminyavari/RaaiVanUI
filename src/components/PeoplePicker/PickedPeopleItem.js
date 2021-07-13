import React from 'react';
import { PickedAvatar, PickedContent } from './PepolePicker.style';

const PickedPeopleItem = ({ avatarUrl, index }) => {
  return (
    <PickedContent index={index}>
      <PickedAvatar
        src={avatarUrl}
        style={{ borderWidth: '0.1rem' }}
        className={'rv-bg-color-distant rv-border-white'}
      />
    </PickedContent>
  );
};
export default PickedPeopleItem;

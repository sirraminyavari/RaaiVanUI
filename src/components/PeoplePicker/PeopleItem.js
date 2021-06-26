import Heading from 'components/Heading/Heading';
import React from 'react';
import { Avatar, PeopleItemContent } from './PepolePicker.style';

const PeopleItem = ({ item, onClick }) => {
  const { avatarUrl, name } = item;

  const onChoose = () => {
    onClick && onClick(item);
  };
  return (
    <PeopleItemContent onClick={onChoose}>
      <Avatar src={avatarUrl} />
      <Heading type={'H6'}>{name}</Heading>
    </PeopleItemContent>
  );
};
export default PeopleItem;

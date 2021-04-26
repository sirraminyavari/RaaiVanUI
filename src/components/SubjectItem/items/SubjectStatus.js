/**
 * A 'component' for rendering the status of the item.
 */

import AnimatedDropDownList from 'components/DropDownList/AnimatedDropDownList';
import EditIcon from 'components/Icons/EditIcon/Edit';
import React, { useState } from 'react';
import styled from 'styled-components';

const data = [
  {
    icon: <EditIcon color={'blue'} />,
    label: 'در دست اقدام مدیریت',
    value: 'a',
    color: 'blue',
  },
  {
    icon: <EditIcon color={'#E2234F'} />,
    label: 'جلسات توجیهی با مشتری',
    value: 'b',
    color: '#E2234F',
  },
  {
    icon: <EditIcon color={'#2B7BE4'} />,
    label: 'در حین رسیدگی',
    value: 'c',
    color: '#2B7BE4',
  },
  {
    // icon: <EditIcon color={'#F1A307'} />,
    label: 'مراحل پایانی',
    value: 'd',
    color: '#F1A307',
  },
];

const SubjectStatus = ({ style }) => {
  const [selectedItem, setSelectedItem] = useState(data[0]);

  const onSelectItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <Container style={style}>
      <AnimatedDropDownList
        data={data}
        onSelectItem={onSelectItem}
        defaultValue={selectedItem}
        hiddenSelectedItem={false}
      />
    </Container>
  );
};
export default SubjectStatus;

const Container = styled.div`
  display: flex;
  padding: 0 0.5rem 0 0.5rem;
  width: 100%;
  align-self: center;
  align-items: center;
  justify-content: center;
`;

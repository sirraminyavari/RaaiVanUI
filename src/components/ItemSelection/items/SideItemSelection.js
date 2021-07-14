import Button from 'components/Buttons/Button';
import React from 'react';
import styled from 'styled-components';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import ClassItem from './ClassItem';

const data = [
  { title: 'درس آموخته سنجه محور', count: 13 },
  { title: 'درس آموخته حادثه محور', count: 53 },
  { title: 'نامه صادره', count: 89 },
  { title: 'نامه وارده', count: 53 },
  { title: 'پروپوزال', count: 13 },
  { title: 'تکنولوژی', count: 53 },
];
const SideItemSelection = () => {
  return (
    <Container>
      <div>
        {data.map((x) => (
          <ClassItem title={x?.title} badge={x?.count} />
        ))}
      </div>
      <Button type={'primary'}>{'ثبت ۲ ایتم انتخاب شده'}</Button>
    </Container>
  );
};

export default SideItemSelection;

const Container = styled.div`
  width: ${() => (DimensionHelper().isTabletOrMobile ? '11rem' : '16.75rem')};
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin: 0rem 1rem 0rem 1rem;
  padding: 1rem 0 1rem 0rem;
`;

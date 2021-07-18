import Button from 'components/Buttons/Button';
import AnimatedDropDownList from 'components/DropDownList/AnimatedDropDownList';
import { CV_GRAY, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import React, { useState } from 'react';
import styled from 'styled-components';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import ClassItem from './ClassItem';

const { RV_RTL } = window || {};

const data = [
  { title: 'درس آموخته سنجه محور', count: 13 },
  { title: 'درس آموخته حادثه محور', count: 53 },
  { title: 'نامه صادره', count: 89 },
  { title: 'نامه وارده', count: 53 },
  { title: 'پروپوزال', count: 13 },
  { title: 'تکنولوژی', count: 53 },
];

const dropDown = [
  {
    label: 'همه آیتم ها',
    value: 'urgentAction',
    colorClass: 'rv-gray',
  },
  {
    label: 'مالکیت های معنوی من',
    value: 'urgentAction',
    colorClass: 'rv-default',
  },
  {
    label: 'موضوعاتی که در آن خبره ام',
    value: 'urgentAction',
    colorClass: 'rv-gray',
  },
  {
    label: 'گروه های من',
    value: 'urgentAction',
    colorClass: 'rv-gray',
  },
];
const defaultDropDownLabel = {
  label: 'گروه های من',
  value: 'urgentAction',
  color: TCV_DEFAULT,
};
const SideItemSelection = ({ checkedList }) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isHovered, setIsDropDownHovered] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedItem, setSelectedItem] = useState(defaultDropDownLabel);
  const onSelectItem = (item) => {
    setSelectedItem(item);
  };
  const onClassClick = (item) => {
    setSelectedClass(item);
  };

  const commonProps = { borderRadius: '10rem' };

  const isDropDownHovered = isDropDownOpen || isHovered;

  return (
    <Container>
      <div>
        <div
          onMouseEnter={() => setIsDropDownHovered(true)}
          onMouseLeave={() => setIsDropDownHovered(false)}
          style={{ marginBottom: '1rem' }}>
          <AnimatedDropDownList
            data={dropDown}
            onSelectItem={onSelectItem}
            defaultValue={selectedItem}
            hiddenSelectedItem={false}
            onClickLabel={() => onSelectItem(selectedItem)}
            customStyle={{
              label: { minWidth: '8rem' },
              container: { backgroundColor: CV_WHITE },
              button: RV_RTL
                ? {
                    borderBottomLeftRadius: '10rem',
                    borderTopLeftRadius: '10rem',
                    borderWidth: isDropDownHovered
                      ? '0.5px 0px 0.5px 0.5px'
                      : '0 0 0 0',
                  }
                : {
                    borderBottomRightRadius: '10rem',
                    borderTopRightRadius: '10rem',
                    borderWidth: isDropDownHovered
                      ? '0.5px 0.5px 0.5px 0px'
                      : '0 0 0 0',
                  },
              label: RV_RTL
                ? {
                    borderBottomRightRadius: '10rem',
                    borderTopRightRadius: '10rem',
                    borderWidth: isDropDownHovered
                      ? '0.5px 0.5px 0.5px 0px'
                      : '0 0 0 0',
                  }
                : {
                    borderBottomLeftRadius: '10rem',
                    borderTopLeftRadius: '10rem',
                    borderWidth: isDropDownHovered
                      ? '0.5px 0px 0.5px 0.5px'
                      : '0 0 0 0',
                  },
            }}
            customClass={{
              dividerClass: 'rv-bg-color-distant',
              labelClass: `rv-bg-color-white rv-border-distant rv-border-radius-1 ${
                RV_RTL ? 'rv-ignore-left-radius' : 'rv-ignore-right-radius'
              }`,
              buttonClass: isDropDownOpen
                ? `rv-bg-color-white rv-border-distant rv-border-radius-1 ${
                    RV_RTL ? 'rv-ignore-right-radius' : 'rv-ignore-left-radius'
                  }`
                : `rv-bg-color-white rv-border-distant rv-border-radius-1 ${
                    RV_RTL ? 'rv-ignore-right-radius' : 'rv-ignore-left-radius'
                  }`,
              arrowIconColorClass: 'rv-gray',
            }}
            onDropDownOpen={setIsDropDownOpen}
          />
        </div>
        {data.map((x) => (
          <ClassItem
            onClick={onClassClick}
            isSelected={selectedClass?.title === x?.title}
            item={x}
            title={x?.title}
            badge={x?.count}
          />
        ))}
      </div>
      <div>
        {checkedList?.length > 0 && (
          <ChoosedItems
            className={
              'rv-border-radius-half rv-border-distant rv-bg-color-white rv-default'
            }>
            {'موارد انتخاب شده'}
            <Badge>{checkedList.length}</Badge>
          </ChoosedItems>
        )}
        <Button type={'primary'}>{'ثبت ۲ ایتم انتخاب شده'}</Button>
      </div>
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
const ChoosedItems = styled.div`
  padding: 0.6rem 1rem 0.6rem 1rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.7rem;
  align-items: center;
`;
const Badge = styled.div`
  background-color: ${({ $isSelected }) =>
    $isSelected ? CV_WHITE : TCV_DEFAULT};
  border-radius: 5rem;
  width: 1.5rem;
  height: 1.5rem;
  aspect-ratio: 1;
  color: ${({ $isSelected }) => ($isSelected ? TCV_DEFAULT : CV_WHITE)};
  display: flex;
  align-items: center;
  justify-content: center;
`;

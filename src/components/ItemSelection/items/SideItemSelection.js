import Button from 'components/Buttons/Button';
import AnimatedDropDownList from 'components/DropDownList/AnimatedDropDownList';
import {
  CV_GRAY,
  CV_GRAY_LIGHT,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_WARM,
} from 'constant/CssVariables';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import ClassItem from './ClassItem';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import { decodeBase64 } from 'helpers/helpers';

const { RV_RTL, RVDic } = window || {};

const data = [
  { title: 'درس آموخته سنجه محور', count: 13 },
  { title: 'درس آموخته حادثه محور', count: 53 },
  { title: 'نامه صادره', count: 89 },
  { title: 'نامه وارده', count: 53 },
  { title: 'پروپوزال', count: 13 },
  { title: 'تکنولوژی', count: 53 },
  { title: 'تکنولوژی', count: 53 },
  { title: 'تکنولوژی', count: 53 },
  { title: 'تکنولوژی', count: 53 },
  { title: 'تکنولوژی', count: 53 },
  { title: 'تکنولوژی', count: 53 },
  { title: 'تکنولوژی', count: 53 },
  { title: 'تکنولوژی', count: 53 },
  { title: 'تکنولوژی', count: 53 },
  { title: 'تکنولوژی', count: 53 },
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
const SideItemSelection = ({
  checkedList,
  onShowSelectedItems,
  isShowSelected,
  classes,
  counts,
  onSelectedodeTypeId,
  multiSelection,
  onConfirm,
}) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isHovered, setIsDropDownHovered] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedItem, setSelectedItem] = useState(defaultDropDownLabel);
  const onSelectItem = (item) => {
    setSelectedItem(item);
  };
  const onClassClick = (item) => {
    setSelectedClass(item);
    console.log(item, 'node node', selectedClass);
    if (item?.NodeTypeID === selectedClass?.NodeTypeID) {
      setSelectedClass(null);
    } else {
      setSelectedClass(item);
    }
  };
  const onSelectNodeTypeId = (node) => {};

  useEffect(() => {
    onSelectedodeTypeId(selectedClass);
  }, [selectedClass]);

  const commonProps = { borderRadius: '10rem' };

  const isDropDownHovered = isDropDownOpen || isHovered;

  return (
    <Container>
      <SideContent>
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
              container: { backgroundColor: CV_GRAY_LIGHT },
              button: RV_RTL
                ? {
                    borderBottomLeftRadius: '1rem',
                    borderTopLeftRadius: '1rem',
                    borderWidth: isDropDownHovered
                      ? '0.5px 0px 0.5px 0.5px'
                      : '0 0 0 0',
                  }
                : {
                    borderBottomRightRadius: '1rem',
                    borderTopRightRadius: '1rem',
                    borderWidth: isDropDownHovered
                      ? '0.5px 0.5px 0.5px 0px'
                      : '0 0 0 0',
                  },
              label: RV_RTL
                ? {
                    borderBottomRightRadius: '1rem',
                    borderTopRightRadius: '1rem',
                    borderWidth: isDropDownHovered
                      ? '0.5px 0.5px 0.5px 0px'
                      : '0 0 0 0',
                  }
                : {
                    borderBottomLeftRadius: '1rem',
                    borderTopLeftRadius: '1rem',
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
        <PerfectScrollbar
          style={{ maxHeight: '60vh', height: '60%' }}
          containerRef={(ref) => {
            if (ref) {
              ref._getBoundingClientRect = ref.getBoundingClientRect;

              ref.getBoundingClientRect = () => {
                const original = ref._getBoundingClientRect();

                return { ...original, height: Math.round(original.height) };
              };
            }
          }}>
          {console.log(classes, 'classes classes')}
          {classes?.map((x) => (
            <ClassItem
              onClick={onClassClick}
              isSelected={selectedClass?.NodeTypeID === x?.NodeTypeID}
              item={x}
              title={decodeBase64(x?.NodeType)}
              badge={counts.find((y) => y?.NodeTypeID === x?.NodeTypeID)?.Count}
            />
          ))}
        </PerfectScrollbar>
      </SideContent>
      <div style={{ marginTop: '2rem' }}>
        {checkedList?.length > 0 && (
          <ChoosedItems
            onClick={onShowSelectedItems}
            $isShowSelected={isShowSelected}
            className={
              'rv-border-radius-half rv-border-distant rv-bg-color-white rv-default'
            }>
            {'موارد انتخاب شده'}
            <Badge $isShowSelected={isShowSelected}>{checkedList.length}</Badge>
          </ChoosedItems>
        )}
        {multiSelection && (
          <Button type={'primary'} onClick={onConfirm}>
            {RVDic.Confirm}
          </Button>
        )}
      </div>
    </Container>
  );
};

export default SideItemSelection;

const Container = styled.div`
  width: ${() => (DimensionHelper().isTabletOrMobile ? '11rem' : '16.75rem')};
  height: 70vh;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin: 0rem 1rem 0rem 1rem;
  padding: 1rem 1rem 1rem 1rem;
  background-color: ${CV_GRAY_LIGHT};
`;
const ChoosedItems = styled.div`
  padding: 0.6rem 1rem 0.6rem 1rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.7rem;
  align-items: center;
  background-color: ${({ $isShowSelected }) =>
    $isShowSelected ? TCV_WARM : CV_WHITE};
  color: ${({ $isShowSelected }) => ($isShowSelected ? CV_WHITE : TCV_WARM)};
`;
const Badge = styled.div`
  background-color: ${({ $isShowSelected }) =>
    $isShowSelected ? CV_WHITE : TCV_DEFAULT};
  border-radius: 5rem;
  width: 1.5rem;
  height: 1.5rem;
  aspect-ratio: 1;
  color: ${({ $isShowSelected }) => ($isShowSelected ? TCV_DEFAULT : CV_WHITE)};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SideContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

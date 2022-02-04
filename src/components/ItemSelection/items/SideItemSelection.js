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
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import { decodeBase64 } from 'helpers/helpers';
import Toggle from 'components/Toggle/Toggle';

const { RV_RTL, RVDic } = window || {};

const switches = [
  {
    label: 'همه آیتم ها',
    value: false,
    paramName: 'all',
  },
  {
    label: 'موضوعاتی که در آن خبره ام',
    value: false,
    paramName: 'IsExpertiseDomain',
  },
  {
    label: 'گروه های من',
    value: false,
    paramName: 'IsGroup',
  },
];
const defaultDropDownLabel = {
  label: 'گروه های من',
  value: false,
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
  onSelectFilters,
}) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isHovered, setIsDropDownHovered] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedItem, setSelectedItem] = useState(defaultDropDownLabel);
  const [filterSwitches, setFilterSwitchs] = useState(switches);
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
  useEffect(() => {
    onSelectFilters(filterSwitches);
  }, [filterSwitches]);

  const commonProps = { borderRadius: '10rem' };

  const isDropDownHovered = isDropDownOpen || isHovered;

  const filterSwitchManagement = (x, i) => {
    if (i === 0) {
      setFilterSwitchs(
        filterSwitches.map((y, index) => {
          return { ...y, value: !x.value };
        })
      );
    } else {
      setFilterSwitchs(
        filterSwitches.map((y, index) =>
          index === i ? { ...y, value: !x.value } : y
        )
      );
    }
    if (i !== 0 && !x.value) {
      setFilterSwitchs(
        filterSwitches.map((y, index) =>
          index === 0 ? { ...y, value: false } : y
        )
      );
    }
  };

  return (
    <Container>
      <SideContent>
        <SideSwitchesContainer>
          {filterSwitches.map((x, i) => {
            return (
              <SwitchItem>
                {console.log(x, 'XXXXXXX')}
                <Toggle
                  isChecked={x.value}
                  onToggle={() => filterSwitchManagement(x, i)}
                  titleClass={'rv-warm'}
                  title={x.label}
                  titleStyle={{ fontSize: '0.8rem' }}
                />
              </SwitchItem>
            );
          })}
        </SideSwitchesContainer>
        <ScrollBarProvider
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
        </ScrollBarProvider>
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
const SideSwitchesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;
const SwitchItem = styled.div`
  margin: 0.5rem;
`;

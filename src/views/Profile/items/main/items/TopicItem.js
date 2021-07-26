import { useState } from 'react';
import {
  CV_GRAY,
  CV_RED,
  TCV_DEFAULT,
  TCV_VERYWARM,
  TCV_WARM,
} from 'constant/CssVariables';
import * as Styled from 'views/Profile/Profile.styles';
import Avatar from 'components/Avatar/Avatar';
import AnimatedDropDownList from 'components/DropDownList/AnimatedDropDownList';
import PieChart from 'components/PieChart/PieChart';
import { BG_FREEZED, C_RED, TC_DEFAULT, TC_VERYWARM } from 'constant/Colors';
import {
  BO_RADIUS_QUARTER,
  IGNORE_RADIUS_LEFT,
  IGNORE_RADIUS_RIGHT,
} from 'constant/constants';

const STEP_1 = 25;
const STEP_2 = 50;
const STEP_3 = 75;
const STEP_4 = 90;
const PIE_SIZE = 1.2;

const options = [
  {
    icon: <PieChart size={PIE_SIZE} percentage={STEP_1} color={CV_RED} />,
    label: 'جلسات توجیهی اولیه با مشتری',
    colorClass: C_RED,
    percentage: STEP_1,
  },
  {
    icon: <PieChart size={PIE_SIZE} percentage={STEP_2} color={TCV_DEFAULT} />,
    label: 'در حین رسیدگی',
    colorClass: TC_DEFAULT,
    percentage: STEP_2,
  },
  {
    icon: <PieChart size={PIE_SIZE} percentage={STEP_3} color="orange" />,
    label: ' مراحل پایانی کار',
    colorClass: 'topic-option-orange',
    percentage: STEP_3,
  },
  {
    icon: <PieChart size={PIE_SIZE} percentage={STEP_4} color={TCV_VERYWARM} />,
    label: 'در دست اقدام مدیریت',
    colorClass: TC_VERYWARM,
    percentage: STEP_4,
  },
];

const defaultDropDownLabel = {
  icon: <PieChart size={PIE_SIZE} percentage={STEP_4} color={TCV_VERYWARM} />,
  label: 'در دست اقدام مدیریت',
  value: null,
  color: `${TCV_VERYWARM}`,
  percentage: STEP_4,
};

const TopicItem = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(defaultDropDownLabel);

  const getColor = (percentage) => {
    switch (percentage) {
      case STEP_1:
        return CV_RED;
      case STEP_2:
        return TCV_DEFAULT;
      case STEP_3:
        return 'orange';
      default:
        return TCV_VERYWARM;
    }
  };

  const handleSelectItem = (value) => {
    const item = {
      label: value.label,
      color: getColor(value.percentage),
      value: null,
      icon: value.icon,
      percentage: value.percentage,
    };
    setSelectedItem(item);
    console.log(value);
  };

  return (
    <Styled.TopicItemWrapper>
      <Styled.TopicItemIconWrapper>
        <img width={50} src="../../images/Preview.png" alt="topic-item-logo" />
        <span style={{ fontSize: '0.7rem', color: CV_GRAY }}>1395/09/06</span>
      </Styled.TopicItemIconWrapper>
      <Styled.TopicItemContentWrapper>
        <Styled.TopicItemContentTitle>
          <span
            style={{ fontSize: '1rem', fontWeight: '500', color: TCV_WARM }}>
            نامه دستورالعمل ساختار شکست پروژه
          </span>
          <span style={{ fontSize: '0.7rem', color: CV_GRAY }}>1395960182</span>
        </Styled.TopicItemContentTitle>
        <Styled.TopicItemContentActions>
          <AnimatedDropDownList
            data={options.filter(
              (opt) => opt.percentage !== selectedItem.percentage
            )}
            defaultValue={selectedItem}
            onSelectItem={handleSelectItem}
            onDropDownOpen={setIsDropDownOpen}
            hiddenSelectedItem={false}
            customStyle={{
              label: { minWidth: '12.5rem', fontSize: '0.7rem' },
              container: {
                margin: '0 1rem',
                backgroundColor: 'transparent',
                width: 'auto',
              },
            }}
            customClass={{
              labelClass: `${BG_FREEZED} ${BO_RADIUS_QUARTER} ${IGNORE_RADIUS_LEFT}`,
              buttonClass: `${BG_FREEZED} ${BO_RADIUS_QUARTER} ${IGNORE_RADIUS_RIGHT}`,
              arrowIconColorClass: `${TC_DEFAULT}`,
            }}
          />
          <Avatar color="#333" />
        </Styled.TopicItemContentActions>
      </Styled.TopicItemContentWrapper>
    </Styled.TopicItemWrapper>
  );
};

export default TopicItem;

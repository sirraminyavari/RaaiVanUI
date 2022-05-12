import styled from 'styled-components';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import Input from 'components/Inputs/Input';
import {
  CV_DISTANT,
  CV_WHITE,
  TCV_VERY_TRANSPARENT,
  CV_BLACK,
  TCV_WARM,
} from 'constant/CssVariables';
import { BG_WHITE, C_GRAY, TC_WARM } from 'constant/Colors';
import {
  BO_RADIUS_CIRCLE,
  BO_RADIUS_HALF,
  BO_RADIUS_UNIT,
  IGNORE_RADIUS_BOTTOM,
} from 'constant/constants';
import {
  FLEX_CSC,
  FLEX_RCB,
  FLEX_RCC,
  FLEX_RCE,
  FLEX_RCS,
  FLEX_RSS,
} from 'constant/StyledCommonCss';
import Heading from 'components/Heading/Heading';

const { GlobalUtilities } = window;

export const Fixer = styled.div`
  background-color: green;
  overflow: scroll;
`;

export const Container = styled.div`
  display: flex;
  ${({ RV_RTL }) =>
    RV_RTL ? 'flex-direction:row' : 'flex-direction:row-reverse'}
  width: 100%;
  align-items: flex-start;
  justify-content: center;
  padding-block: 2rem;
`;
export const ScrollProvider = styled.div`
  width: calc(${({ isAdvancedShow }) => (isAdvancedShow ? '100%' : '100%')});

  box-shadow: 1px 3px 20px #0000001f;
`;
export const Scrollable = styled.div`
  width: 100%;
`;
export const Maintainer = styled.div`
  width: 100%;
  max-height: 100%;
  transition: min-width 0.5s, width 0.5s, left 0.5s;
`;
export const Side = styled.div`
  position: fixed;
  top: 7rem;
  ${({ dir }) => dir}: 0;
  height: calc(100vh - 9rem);
  padding: ${({ rtl }) => (rtl ? '0 0.5rem 0 1rem' : '0 1rem 0 0.5rem')};
  opacity: ${({ $isEnabled }) => ($isEnabled ? '1' : '0')};
  width: ${({ $isEnabled }) => ($isEnabled ? '25rem' : '0rem')};
  // transition: width 0.5s, opacity 0.5s;
  z-index: 10;
`;

export const TopFilter = styled.div`
  width: 100%;

  margin-bottom: 1rem;
  align-self: center;
  display: flex;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${() =>
    DimensionHelper()?.isTabletOrMobile ? 'center' : 'flex-end'};
  align-items: center;

  min-width: ${() => (DimensionHelper()?.isTabletOrMobile ? '90%' : '50%')};
`;
export const CustomInput = styled(Input)`
  min-width: ${() => (DimensionHelper()?.isTabletOrMobile ? '90%' : '90%')};
  border-width: 0;
  border-bottom-width: 1px;
  border-color: ${CV_DISTANT};
  border-radius: 0;
  margin: 0rem 1rem 0 1rem;
  ::placeholder {
    color: ${CV_DISTANT};
    font-size: 1.1rem;
    font-weight: 500;
  }
`;
export const AdvancedFilterDialog = styled.div`
  position: absolute;
  background-color: ${CV_WHITE};
  top: ${({ top }) => top + 53 + 'px'};
  left: ${({ left }) => left + 'px'};
  width: 30rem;
  min-height: 10rem;
  z-index: ${GlobalUtilities.zindex.alert()};
  box-shadow: 1px 3px 20px ${CV_DISTANT};
`;
export const Space = styled.div`
  width: ${({ $isEnabled, mobileView }) =>
    $isEnabled && !mobileView ? '25rem' : '0rem'};
  ${({ dir }) => dir}: 0;
  height: 1rem;
  // padding: ${({ rtl }) => (rtl ? '0 0.5rem 0 1rem' : '0 1rem 0 0.5rem')};
  transition: width 0.5s;
`;

export const SideColumnMaintainer = styled.div`
  box-shadow: 1px 3px 20px #0000001f;
  // display: flex;
  // flex: 1;
  width: 100%;
  height: 100%;
  user-select: none;

  .node-page-side-scrollbar {
    padding: 0.5rem 1rem;
    height: calc(100% - 3rem);
  }

  .node-page-side-modal-header {
    height: 3rem;
    padding: 0 0.7rem;
  }

  .node-page-side-modal-content {
    max-height: calc(100vh - 4.5rem);
  }
`;

export const SideColumnHeader = styled.div.attrs({
  className: `${BG_WHITE} ${BO_RADIUS_HALF} ${IGNORE_RADIUS_BOTTOM}`,
})`
  width: 100%;
  height: 3rem;
  padding: 0 0.7rem;
  ${FLEX_RCB}

  .side-more-action-tooltip {
    width: 10rem;
    height: 3rem;
    padding: 0.5rem;
    color: ${CV_BLACK};
    background-color: ${CV_WHITE} !important;
    opacity: 1 !important;
    box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT} !important;
    border-radius: 0.5rem;
    ${FLEX_RCS}
  }
`;

export const SideHeaderIconWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  padding: 0.25rem;
  cursor: pointer;
  ${FLEX_RCC}

  :hover {
    background-color: ${TCV_VERY_TRANSPARENT};
  }
`;

export const SideHeaderTitle = styled.div.attrs({
  className: `${TC_WARM}`,
})`
  font-size: 1rem;
`;

export const SideActionItemWrapper = styled.div`
  width: 100%;
  font-size: 1rem;
  ${FLEX_RCS}
  gap: 0.5rem;
  cursor: pointer;
`;

export const SideInfoContainer = styled.div`
  width: 100%;
  ${FLEX_RCS}
  background-color: inherit;
  gap: 0.5rem;
`;

export const InfoImageWrapper = styled.div.attrs({
  className: `${BO_RADIUS_UNIT} ${BG_WHITE}`,
})`
  width: 5rem;
  min-width: 5rem;
  height: 5rem;
  max-height: 5rem;
  padding: 0.2rem;
  ${FLEX_RCC}
`;

export const InfosWrapper = styled.div`
  width: 100%;
  padding: 0.2rem;
  ${FLEX_CSC}
  gap: 0.3rem;
`;

export const DocInfoTitle = styled.div.attrs({
  className: `${C_GRAY}`,
})`
  width: 100%;
  font-size: 1rem;
`;

export const DocInfoID = styled.div.attrs({
  className: `${C_GRAY}`,
})`
  width: 100%;
  font-size: 0.8rem;
`;

export const DocTagsContainer = styled.div`
  width: 100%;
  ${FLEX_RCS}
  flex-wrap: wrap;
  gap: 0.2rem;

  .doc-tags-badge {
    font-size: 0.85rem;
    border-radius: 1rem;
    width: max-content;
    padding: 0 0.7rem;
    ${FLEX_RCC}
    color: ${TCV_WARM};
    background-color: ${TCV_VERY_TRANSPARENT};
  }
`;

export const DocHistoryLogContainer = styled.div.attrs({
  className: `${BG_WHITE} ${BO_RADIUS_UNIT}`,
})`
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.5rem;
  height: 9rem;
`;

export const DocItemHeader = styled.div`
  ${FLEX_RCB}
  cursor: pointer;
`;

export const ItemHeaderTitle = styled(Heading)`
  font-size: 1rem;
`;
// export const ItemHeaderTitle = styled.div.attrs({
//   className: `${C_GRAY_DARK}`,
// })`
//   font-size: 1rem;
//   weight: 600;
// `;

export const LogItemContainer = styled.div`
  ${FLEX_RCB}
  gap:  0.2rem;
  cursor: pointer;
  margin: 1rem 0;

  .log-item-avatar {
    width: 2.2rem;
    height: 2.2rem;
    min-width: 2.2rem;
    min-height: 2.2rem;
    border: none;
  }
`;

export const LogWrapper = styled.div`
  width: 45%;
  ${({ start }) => start && FLEX_RCS}
  ${({ end }) => end && FLEX_RCE}
  gap: 0.2rem;
`;
export const Line = styled.div`
  height: 1.3rem;
  margin: 0 0.5rem;
  border: none;
  border-right: 3px solid ${CV_DISTANT};
`;

export const LogItemTitle = styled.div.attrs({
  className: `${C_GRAY}`,
})`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LogItemRecordDate = styled.div`
  width: 100%;
`;

export const DocSettingContainer = styled.div.attrs({
  className: `${BG_WHITE} ${BO_RADIUS_UNIT}`,
})`
  width: 100%;
  margin-top: 1.2rem;
  padding: 0.5rem;
  height: 6rem;
  cursor: pointer;
`;

export const DocSettingTitle = styled.div.attrs({
  className: `${C_GRAY}`,
})`
  margin: 1rem 0;
  font-size: 0.8rem;
`;

export const TimeLineContainer = styled.div`
  max-height: calc(100vh - 11rem);
`;

export const TimeLineItemContainer = styled.div`
  position: relative;
  width: calc(100% - 2rem);
  padding: 0 0.8rem 1rem 0;
  margin-right: 1rem;
  ${FLEX_RSS}

  //! Circle
  &::before {
    content: '';
    position: absolute;
    top: 15%;
    right: -0.7rem;
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;
    border: 2px solid ${CV_DISTANT};
  }

  //! Vertical line
  &::after {
    content: '';
    position: absolute;
    top: 40%;
    right: -0.1rem;
    height: 3.6rem;
    border: 1px solid ${CV_DISTANT};
    ${({ isLast }) => isLast && 'display: none;'}
  }
`;

export const TimeLineTitle = styled.div.attrs({
  className: `${C_GRAY}`,
})`
  font-size: 1rem;
  padding: 0.5rem;
`;
export const TimeLineDate = styled.div.attrs({
  className: `${C_GRAY}`,
})`
  padding: 0 0.5rem;
`;

export const SettingContainer = styled.div`
  padding: 1rem;

  .side-setting-toggle {
    margin: 1rem 0;
    font-weight: 500;
  }
`;

export const SecuritySelectWrapper = styled.div`
  ${FLEX_RCB}
  gap: 1rem;
  padding: 0.5rem 1rem;
`;

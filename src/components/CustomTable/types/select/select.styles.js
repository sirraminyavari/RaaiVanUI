import styled from 'styled-components';
import {
  CV_BLACK,
  CV_FREEZED,
  CV_RED,
  TCV_DEFAULT,
  TCV_VERY_SOFT,
} from 'constant/CssVariables';
import { BO_RADIUS_HALF, BO_RADIUS_QUARTER } from 'constant/constants';
import { BG_WHITE, BO_DISTANT, TBG_SOFT, TBG_VERY_SOFT } from 'constant/Colors';
import { FLEX_RCC } from 'constant/StyledCommonCss';

const { GlobalUtilities, RV_Float, RV_RevFloat } = window;

export const selectStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: 'inherit',
  }),
  option: (styles, { isSelected }) => ({
    ...styles,
    backgroundColor: isSelected && TCV_DEFAULT,
    width: '90%',
    margin: '0.3rem auto',
    borderRadius: '0.2rem',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: !isSelected && CV_FREEZED,
    },
    ':active': {
      ...styles[':active'],
      backgroundColor: isSelected && TCV_DEFAULT,
    },
  }),
  indicatorsContainer: (styles) => ({
    ...styles,
    svg: {
      color: TCV_DEFAULT,
    },
  }),
  singleValue: (styles) => ({
    ...styles,
    backgroundColor: TCV_VERY_SOFT,
    padding: '0.2rem',
    fontSize: '0.9rem',
    borderRadius: '0.2rem',
    maxWidth: '95%',
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: TCV_VERY_SOFT,
    padding: '0.1rem',
    fontSize: '1rem',
    borderRadius: '0.2rem',
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: CV_BLACK,
    ':hover': {
      color: CV_RED,
      cursor: 'pointer',
    },
  }),
};

export const SelectContainer = styled.div`
  width: 100%;
`;

//! Old version.
export const SelectCellContainer = styled.div.attrs({
  className: `${BO_DISTANT} ${BO_RADIUS_HALF}`,
})`
  width: 100%;
  min-height: 2.5rem;
  height: auto;
  position: relative;
  // display: flex;
  // justify-content: space-between;
  // align-items: center;
  ${({ isEmpty }) => isEmpty && `border: 1px solid ${CV_RED};`}

  .select-option-caret {
    position: absolute;
    ${RV_RevFloat}: 0.4rem;
    top: 50%;
    transform: translate(0, -50%);
    cursor: pointer;
  }
`;

export const SelectedItemsWrapper = styled.div`
  width: 90%;
  min-height: inherit;
  margin: auto 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-content: center;
  gap: 0.3rem;
  padding: 0.25rem;

  // justify-content: flex-start;
  // align-items: center;
  // border: 1px solid #333;
`;

export const SelectedOption = styled.div.attrs({
  className: `${TBG_SOFT} ${BO_RADIUS_QUARTER}`,
})`
  position: relative;
  width: 100%;
  min-width: max-content;
  height: 2rem;
  // margin: 0 0.3rem;
  // white-space: nowrap;
  // overflow: hidden;
  // text-overflow: ellipsis;
  padding: 0 1em;
  // ${FLEX_RCC}

  .selected-option-cancel-icon {
    position: absolute;
    top: -0.3rem;
    right: -0.3rem;
    cursor: pointer;
  }
`;

export const SelectOptionsContainer = styled.div.attrs({
  className: `${BG_WHITE} ${BO_DISTANT} ${BO_RADIUS_HALF}`,
})`
  width: max-content;
  min-width: 100%;
  min-height: 2rem;
  max-height: 7.5rem;
  position: absolute;
  top: ${({ rowCount }) => (!!rowCount ? `${rowCount * 2.5}rem` : '2.6rem')};
  z-index: ${GlobalUtilities?.zindex?.dialog() || 1000};
  padding: 0.2rem 0rem;

  .table-select-options-scroll {
    .ps__thumb-y {
      background-color: ${CV_BLACK} !important;
      width: 0.25rem !important;
    }
    .ps__rail-y:hover {
      background-color: transparent !important;
    }
    .ps__rail-y {
      ${RV_Float}: -0.45rem !important;
    }
  }
`;

export const SelectOptionWrapper = styled.div.attrs({
  className: `${TBG_VERY_SOFT} ${BO_DISTANT} ${BO_RADIUS_HALF}`,
})`
  width: calc(100% - 1rem);
  height: 2rem;
  margin: 0.25rem 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  border-radius: 0.2rem;
  cursor: pointer;
  padding: 0 0.5rem;
`;

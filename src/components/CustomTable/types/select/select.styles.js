import styled from 'styled-components';
import { CV_BLACK } from 'constant/CssVariables';
import { BO_RADIUS_HALF, BO_RADIUS_QUARTER } from 'constant/constants';
import { BG_WHITE, BO_DISTANT, TBG_SOFT, TBG_VERY_SOFT } from 'constant/Colors';
import { FLEX_RCS } from 'constant/StyledCommonCss';

const { GlobalUtilities, RV_Float, RV_RevFloat } = window;

export const SelectCellContainer = styled.div.attrs({
  className: `${BO_DISTANT} ${BO_RADIUS_HALF}`,
})`
  width: 100%;
  height: 2.5rem;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .select-option-caret {
    position: absolute;
    ${RV_RevFloat}: 0.4rem;
    cursor: pointer;
  }
`;

export const SelectedOption = styled.div.attrs({
  className: `${TBG_SOFT} ${BO_RADIUS_QUARTER}`,
})`
  position: relative;
  width: max-content;
  min-width: max-content;
  height: 78%;
  margin: 0.3rem;
  // white-space: nowrap;
  // overflow: hidden;
  // text-overflow: ellipsis;
  padding-${RV_Float}: 1em;
  ${FLEX_RCS}
`;

export const SelectOptionsContainer = styled.div.attrs({
  className: `${BG_WHITE} ${BO_DISTANT} ${BO_RADIUS_HALF}`,
})`
  width: max-content;
  min-width: 100%;
  min-height: 2rem;
  max-height: 7.5rem;
  position: absolute;
  top: 2.5rem;
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

import styled from 'styled-components';
import {
  BG_WHITE,
  TBG_DEFAULT,
  C_WHITE,
  BO_DISTANT,
  C_DISTANT,
} from 'constant/Colors';
import { FLEX_RCB, FLEX_RCC } from 'constant/StyledCommonCss';
import { BO_RADIUS_QUARTER } from 'constant/constants';
import { CV_DISTANT } from 'constant/CssVariables';

const { RV_RevFloat } = window;

export const ButtonContainer = styled.div.attrs({
  className: `${BO_RADIUS_QUARTER} ${BO_DISTANT}`,
})`
  ${FLEX_RCB}
  width: 6rem;
  height: 2.2rem;
  overflow: hidden;
  user-select: none;
  cursor: pointer;

  div:first-child {
    border-${RV_RevFloat}-width: 1px;
    border-${RV_RevFloat}-style: solid;
    border-${RV_RevFloat}-color: ${CV_DISTANT} !important;
  }
`;

export const OptionWrapper = styled.div.attrs((props) => ({
  className: props.isChecked
    ? `${TBG_DEFAULT} ${C_WHITE} ${props.classes}`
    : `${BG_WHITE} ${C_DISTANT}`,
}))`
  width: 100%;
  flex-grow: 1;
  ${FLEX_RCC}
  font-size: 1rem;
  height: 100%;
  text-transform: capitalize;
`;

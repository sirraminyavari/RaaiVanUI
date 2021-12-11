import styled, { css } from 'styled-components';
import { BG_DISTANT, TBG_DEFAULT, BO_FREEZED } from 'constant/Colors';
import { CV_GRAY_LIGHT } from 'constant/CssVariables';
import { FLEX_RCB } from 'constant/StyledCommonCss';

const { RV_Float, RV_RevFloat } = window;

export const ToggleLabel = styled.label`
  display: inline-block;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ToggleInput = styled.input`
  /* visually hidden but still accessible */
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;

  // :focus + span::after,
  // span:active::after {
  //   box-sizing: initial;
  //       box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08),
  //         inset 0px 0px 0px 3px #9c9c9c;
  // }
`;

const getCheckedCss = (props) => {
  return props.isChecked
    ? css`
        &::after {
          ${RV_RevFloat}: 50%;
        }
        &:active {
          box-shadow: none;
        }
        &:active::after {
          margin-${RV_RevFloat}: -1.6em;
        }
      `
    : css`
        &::after {
          ${RV_Float}: 55%;
        }
        &:active {
          box-shadow: none;
        }
        &:active::after {
          margin-${RV_Float}: -1.6em;
        }
      `;
};

export const ToggleButton = styled.span.attrs((props) => ({
  className: `${props.isChecked ? TBG_DEFAULT : BG_DISTANT} ${BO_FREEZED}`,
}))`
  box-sizing: initial;
  display: inline-block;
  outline: 0;
  width: 2rem;
  height: 0.8rem;
  min-height: 0.8rem;
  max-height: 0.8rem;
  position: relative;
  cursor: pointer;
  user-select: none;
  border-radius: 4em;
  padding: 0.25rem;
  transition: all 0.4s ease;
  ${FLEX_RCB}

  &::after {
    ${RV_Float}: 0;
    position: relative;
    display: block;
    content: '';
    width: 45%;
    height: 1.1em;
    border-radius: 4em;
    background-color: ${CV_GRAY_LIGHT};
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
      padding 0.3s ease, margin 0.3s ease;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08);
  }

  &:active::after {
    padding-${RV_Float}: 1.6em;
  }
  ${getCheckedCss}
`;

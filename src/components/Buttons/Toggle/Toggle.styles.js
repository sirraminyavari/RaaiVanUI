import styled, { css } from 'styled-components';

const { RV_Float } = window;

export const ToggleLabel = styled.label`
  display: inline-block;
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

  :focus + span::after,
  span:active::after {
    box-sizing: initial;
//     box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08),
//       inset 0px 0px 0px 3px #9c9c9c;
//   }
`;

const getCheckedCss = (props) => {
  return props.isChecked
    ? css`
        background: #86d993;
        &::after {
          left: 50%;
        }
        &:active {
          box-shadow: none;
        }
        &:active::after {
          margin-left: -1.6em;
        }
      `
    : css`
        background: #bac9dc;
        &::after {
          right: 50%;
        }
        &:active {
          box-shadow: none;
        }
        &:active::after {
          margin-right: -1.6em;
        }
      `;
};

export const ToggleButton = styled.span`
  box-sizing: initial;
  display: inline-block;
  outline: 0;
  width: 2.6rem;
  height: 1.3rem;
  position: relative;
  cursor: pointer;
  user-select: none;
  background: #fbfbfb;
  border-radius: 4em;
  padding: 4px;
  transition: all 0.4s ease;
  border: 2px solid #e8eae9;

  &::after {
    ${RV_Float}: 0;
    position: relative;
    display: block;
    content: '';
    width: 50%;
    height: 100%;
    border-radius: 4em;
    background: #fbfbfb;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
      padding 0.3s ease, margin 0.3s ease;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08);
  }

  &:active::after {
    padding-right: 1.6em;
  }
  ${getCheckedCss}
`;

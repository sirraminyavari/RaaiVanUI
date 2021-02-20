/**
 * styled-components related to @link AnimatedInput.
 * To understanding the passed props to each styled-component, see @link AnimatedInput.
 */
import InVisibleIcon from 'components/Icons/InVisible';
import VisibleIcon from 'components/Icons/VisibleIcon';
import { MAIN_BLUE } from 'const/Colors';
import styled, { css, keyframes } from 'styled-components';

const { RV_Float } = window;

/**
 * Shakes the children components in Horizontal axis by changing the distance to right
 */
const right = keyframes`

  0%   {right: -1%}
  25%  {right: 1%}
  50%  {right: -1%}
  75%  {right: 1%}
  100% {right: -1%}
`;

export const Maintainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  align-self: center;
  flex-direction: row;
  border: ${({ error, inputFocused, editable }) =>
    !editable
      ? error
        ? 'solid 0.5px red'
        : inputFocused
        ? `solid 1px ${MAIN_BLUE}`
        : 'solid 0.5px #bac9dc'
      : 'solid 0px #bac9dc'};
  border-radius: 7px;
`;

export const Label = styled.label`
  position: relative;
  display: block;
  width: 100%;
  border-radius: 7px;

  ${({ inputFocused }) =>
    inputFocused &&
    `
    background-color: #ffffff;
    text-transform: uppercase;
    letter-spacing: .8px;
    font-size: 11px;
    line-height: 14px;
    -webkit-transform: translateY(0);
    transform: translateY(0);
   

    `};
`;

export const Input = styled.input`
  position: relative;
  display: flex;
  width: 100%;
  outline: none;
  padding: 11px 7px 10px 11px;
  color: #2c3235;
  letter-spacing: 0.2px;
  font-weight: 400;
  font-size: 16px;
  resize: none;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
  text-align: ${RV_Float};
  border: none;
  border-radius: 7px;
  :disabled {
    background: white;
  }
`;

export const Span = styled.span`
  position: absolute;
  top: 50%;
  display: block;
  padding: 0 10px;
  white-space: nowrap;
  letter-spacing: 0.2px;
  font-weight: normal;
  font-size: 16px;
  -webkit-transition: all, 0.2s;
  transition: all, 0.2s;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border-radius: 0.25rem;
  -moz-border-radius: 0.25rem;
  -webkit-border-radius: 0.25rem;
  text-align: ${RV_Float};
  background-color: ${({ inputFocused }) =>
    inputFocused ? `white` : 'rgba(0,0,0,0)'};
  ${({ inputFocused }) =>
    inputFocused ? `${RV_Float}: 10px` : `${RV_Float}: 0px`};
  top: ${({ inputFocused }) => (inputFocused ? `0px` : `50%`)};

  color: ${({ inputFocused, value }) =>
    inputFocused ? `black` : value.length > 0 ? 'rgba(0,0,0,0)' : `#707070`};
  font-size: ${({ inputFocused }) => (inputFocused ? `11px` : `16px`)};
`;
export const Error = styled.span`
  color: red;
  font-size: 0.75rem;
  margin-left: 13px;
  position: relative;
  text-align: ${RV_Float};
  margin-top: 1px;
  opacity: ${({ error }) => (error ? 1 : 0)};
  max-height: ${({ error }) => (error ? '5rem' : 0)};
  min-height: ${({ error }) => (error ? '0rem' : '0rem')};
  transition: max-height 1s, opacity 1s, min-height 1s;
`;
export const VisibleMe = styled(VisibleIcon)`
  color: grey;
  font-size: 23px;
  position: relative;
  left: 7px;
  z-index: 3;
`;
export const InVisibleMe = styled(InVisibleIcon)`
  color: grey;
  font-size: 23px;
  position: relative;
  z-index: 3;
  left: 7px;
`;
export const ShakeAnimate = styled.div`
  position: relative;

  animation: ${({ isVisible }) =>
    isVisible &&
    css`
      ${right} 0.2s
    `};
  width: 100%;
  display: flex;
  flex-direction: row;
`;

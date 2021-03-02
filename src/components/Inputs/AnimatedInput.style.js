/**
 * styled-components related to @link AnimatedInput.
 * To understanding the passed props to each styled-component, see @link AnimatedInput.
 */
import Input from './Input';
import styled from 'styled-components';

const { RV_Float } = window;

export const Container = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledInput = styled(Input)`
  padding: 0.5rem;
  width: 100%;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;

  :disabled {
    //background: white;
  }
`;

export const Placeholder = styled.span`
  position: absolute;
  top: 50%;
  display: block;
  white-space: nowrap;
  letter-spacing: 0.2px;
  font-weight: normal;
  -webkit-transition: all, 0.2s;
  transition: all, 0.2s;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  ${RV_Float}: 0.5rem;
`;

export const Label = styled.label`
  position: relative;
  display: block;
  width: 100%;

  &.active {
    ${Placeholder} {
      top: -10px;
      padding: 2px 10px;
      background-color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-size: 11px;
      line-height: 14px;
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }

    ${StyledInput} {
      &:not(:focus):not(:hover) ~ ${Placeholder} {
        color: rgb(150, 150, 150);
      }
    }
  }
`;

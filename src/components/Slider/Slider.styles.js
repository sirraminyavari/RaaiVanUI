import { CV_WHITE, TCV_DEFAULT, TCV_WARM } from 'constant/CssVariables';
import styled from 'styled-components';

const { RV_RTL } = window;

export const RangeSlider = styled.input`
  overflow: hidden;
  display: block;
  appearance: none;
  width: 100%;
  margin: 0;
  height: 2rem;
  cursor: pointer;
  direction: ${RV_RTL ? 'ltr' : 'rtl'};

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 0.3rem;
    background-color: ${TCV_DEFAULT};
    border-radius: 1rem;
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none;
    height: 1.5rem;
    width: 1.5rem;
    background-color: ${CV_WHITE};
    border: 1px solid ${TCV_WARM};
    border-radius: 100%;
    top: 50%;
    transform: translateY(-50%);
    transition: background-color 150ms;
  }

  &::-moz-range-track,
  &::-moz-range-progress {
    width: 100%;
    height: 1rem;
    background-color: ${TCV_DEFAULT};
  }

  &::-moz-range-progress {
    background-color: ${TCV_DEFAULT};
  }

  &::-moz-range-thumb {
    appearance: none;
    margin: 0;
    height: 1.5rem;
    width: 1.5rem;
    background-color: ${CV_WHITE};
    border: 1px solid ${TCV_WARM};
    border-radius: 100%;
    transition: background-color 150ms;
  }

  &::-ms-track {
    width: 100%;
    height: 1rem;
    border: 0;
    /* color needed to hide track marks */
    color: transparent;
    background: transparent;
  }

  &::-ms-fill-lower {
    background-color: ${TCV_DEFAULT};
  }

  &::-ms-fill-upper {
    background-color: ${TCV_DEFAULT};
  }

  &::-ms-thumb {
    appearance: none;
    height: 1.5rem;
    width: 1.5rem;
    background-color: ${CV_WHITE};
    border: 1px solid ${TCV_WARM};
    border-radius: 100%;
    transition: background-color 150ms;
    /* IE Edge thinks it can support -webkit prefixes */
    top: 0;
    margin: 0;
    box-shadow: none;
  }

//   &:hover,
//   &:focus {
//     &::-webkit-slider-thumb {
//       background-color: yellow;
//     }
//     &::-moz-range-thumb {
//       background-color: yellow;
//     }
//     &::-ms-thumb {
//       background-color: yellow;
//     }
  }
`;

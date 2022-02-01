import styled from 'styled-components';
import ReactSelect from 'react-select';
import { CV_WHITE, TCV_VERY_SOFT } from 'constant/CssVariables';

export const SelectContainer = styled.div`
  width: 100%;
`;

export const Select = styled(ReactSelect)`
  .select__control {
    border: 0.04rem solid var(--rv-color-distant);
    border-radius: 0.3rem;
    background-color: ${CV_WHITE};
    cursor: pointer;
  }

  .select__single-value {
    color: var(--rv-gray-color);
    background-color: transparent;
    text-transform: capitalize;
  }

  .select__control:hover {
    border-color: var(--rv-color-distant);
  }

  .select__control--is-focused {
    border: 0.08rem solid var(--rv-color) !important;
    outline: none;
    box-shadow: none;
  }

  .select__indicator {
    padding: 0;
  }

  .select__indicator-separator {
    display: none;
  }

  .select__menu {
    box-shadow: 1px 3px 5px #2b7be44d;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .select__option {
    color: var(--rv-gray-color);
    text-transform: capitalize;
  }

  .select__option:hover {
    cursor: pointer;
    background-color: ${TCV_VERY_SOFT};
  }

  .select__option--is-selected {
    background-color: transparent;
    color: var(--rv-color-verywarm);
    font-weight: 500;
  }

  .select__option--is-focused:not(.react-select__option--is-selected) {
    background-color: ${TCV_VERY_SOFT};
  }
`;

import styled from 'styled-components';
import { CV_GRAY, CV_WHITE, TCV_WARM } from 'constant/CssVariables';

export const customStyles = {
  option: (
    styles,
    { data, isDisabled, isFocused, isSelected },
    provided,
    state
  ) => ({
    ...provided,
    color: isSelected ? TCV_WARM : CV_GRAY,
    margin: '0.35rem 0.5rem 0.35rem 0.5rem',
    cursor: 'pointer',
    minWidth: '10rem',
  }),
  control: (provided) => ({
    // none of react-select's styles are passed to <Control />
    ...provided,
    borderColor: CV_WHITE,
    backgroundColor: CV_WHITE,
    minWidth: '10rem',

    ':focus': {
      border: 0,
    },
  }),
  singleValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: '#e6f4f1',
      borderRadius: '0.5rem',
      padding: '0.3rem',
      minWidth: '10rem',
      height: '100%',
    };
  },
  menu: (provided) => ({
    ...provided,
    borderColor: '#e6f4f1',
    minWidth: '10rem',
  }),
};

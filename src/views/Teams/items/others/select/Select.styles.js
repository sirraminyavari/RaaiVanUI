import {
  CV_BLACK,
  CV_DISTANT,
  CV_GRAY,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_WARM,
} from 'constant/CssVariables';

const { RV_Float } = window;

export const selectStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: 'inherit',
    borderColor: CV_DISTANT,
    padding: '0.22rem',
  }),
  option: (styles, { isSelected }) => ({
    ...styles,
    backgroundColor: CV_WHITE,
    width: '90%',
    margin: '0.3rem auto',
    borderRadius: '0.2rem',
    color: isSelected ? TCV_WARM : CV_BLACK,
    textAlign: RV_Float,
    fontSize: '0.9rem',
    fontWeight: isSelected ? 'bold' : '300',
    cursor: 'pointer',
    // ':hover': {
    //   backgroundColor: !isSelected && CV_FREEZED,
    // },
    ':active': {
      ...styles[':active'],
      backgroundColor: CV_WHITE,
    },
  }),
  indicatorsContainer: (styles) => ({
    ...styles,
    svg: {
      color: TCV_DEFAULT,
    },
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none',
  }),
  singleValue: (styles) => ({
    ...styles,
    // backgroundColor: CV_DISTANT,
    padding: '0.2rem',
    fontSize: '0.9rem',
    borderRadius: '0.2rem',
    maxWidth: '95%',
    color: CV_GRAY,
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: CV_DISTANT,
    padding: '0.1rem',
    fontSize: '1rem',
    borderRadius: '0.2rem',
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: CV_RED,
    ':hover': {
      cursor: 'pointer',
    },
  }),
};

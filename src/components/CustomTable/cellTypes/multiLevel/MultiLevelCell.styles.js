import styled from 'styled-components';
import { C_GRAY_DARK, TC_DEFAULT } from 'constant/Colors';
import {
  CV_BLACK,
  CV_DISTANT,
  CV_GRAY,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_WARM,
} from 'constant/CssVariables';
import Heading from 'components/Heading/Heading';
import { FLEX_CCC } from 'constant/StyledCommonCss';

const { RV_Float } = window;

export const selectStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: 'inherit',
    borderColor: CV_DISTANT,
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
    fontWeight: isSelected ? '600' : '',
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
    backgroundColor: CV_DISTANT,
    padding: '0.2rem',
    fontSize: '0.9rem',
    borderRadius: '0.2rem',
    maxWidth: '95%',
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

export const MultiLevelContainer = styled.div`
  ${FLEX_CCC}
  gap: 0.2rem;
  width: 100%;
`;

export const SelectWrapper = styled.div`
  width: 100%;
`;

export const SelectLabel = styled.label.attrs({
  className: `${TC_DEFAULT}`,
})`
  width: auto;
  display: inline-block;
  margin: 0.5rem 0;
  font-size: 1rem;
`;

export const EmptyCellView = styled.div`
  color: ${CV_DISTANT};
  width: 100%;
  text-align: start;
  padding-${RV_Float}: 0.7rem;
`;

export const CellView = styled(Heading).attrs({
  className: `${C_GRAY_DARK}`,
})`
  text-align: justify;
  text-justify: inter-word;
`;

export const CellViewContainer = styled.div`
  width: 100%;

  .table-multi-level-view {
    font-weight: 400 !important;
    color: ${CV_BLACK} !important;
    text-align: center;
  }
`;

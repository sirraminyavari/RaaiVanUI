import type { CSSProperties } from 'react';
import styled from 'styled-components';
import {
  CV_BLACK,
  CV_DISTANT,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_WARM,
} from 'constant/CssVariables';
import { BO_RADIUS_QUARTER } from 'constant/constants';
import Heading from 'components/Heading/Heading';

const { RV_Float } = window;

export const selectStyles = {
  control: (styles: CSSProperties) => ({
    ...styles,
    backgroundColor: 'inherit',
    borderColor: CV_DISTANT,
  }),
  option: (styles: CSSProperties, { isSelected }: { isSelected: boolean }) => ({
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
  indicatorsContainer: (styles: CSSProperties) => ({
    ...styles,
    svg: {
      color: TCV_DEFAULT,
    },
  }),
  indicatorSeparator: (styles: CSSProperties) => ({
    ...styles,
    display: 'none',
  }),
  singleValue: (styles: CSSProperties) => ({
    ...styles,
    backgroundColor: CV_DISTANT,
    padding: '0.2rem',
    fontSize: '0.9rem',
    borderRadius: '0.2rem',
    maxWidth: '95%',
  }),
  multiValue: (styles: CSSProperties) => ({
    ...styles,
    backgroundColor: CV_DISTANT,
    padding: '0.1rem',
    fontSize: '1rem',
    borderRadius: '0.2rem',
  }),
  multiValueRemove: (styles: CSSProperties) => ({
    ...styles,
    color: CV_RED,
    ':hover': {
      cursor: 'pointer',
    },
  }),
};

export const SelectWrapper = styled.div`
  width: 100%;
`;

export const SelectedItem = styled(Heading).attrs({
  className: `${BO_RADIUS_QUARTER}`,
})`
  display: inline-block;
  background-color: ${CV_DISTANT};
  padding: 0.3rem;
  margin: 0.2rem;
  width: auto;
`;

export const EmptyCellView = styled.div`
  color: ${CV_DISTANT};
  width: 100%;
  text-align: start;
  padding-inline-start: 0.7rem;
`;

export const CellViewContainer = styled.div`
  width: 100%;

  .table-select-view {
    font-weight: 400 !important;
    color: ${CV_BLACK} !important;
  }
`;

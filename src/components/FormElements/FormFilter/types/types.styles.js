import styled from 'styled-components';
import { C_BLACK } from 'constant/Colors';

const { RV_Float, RV_RTL } = window;

export const FilterTitle = styled.div.attrs({
  className: C_BLACK,
})`
  font-size: 1rem;
`;

export const FilterContainer = styled.div`
  width: 100%;
  margin: 1rem 0;
`;

//! Select styles.
export const SelectContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 1rem 0;
  color: #262261;
`;

export const SelectOptionWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0.3rem 0;

  input[type='radio']:checked + label {
    font-weight: bold;
  }
`;

export const SelectLabel = styled.label`
  margin: 0 0.5rem;
`;

//! Checkbox styles.
export const CheckboxTitleWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0.5rem 0;
`;

export const CheckboxOptionsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0.5rem 0;
  user-select: none;
`;

export const CheckboxOptionsLabel = styled.label`
  margin: 0 0.5rem;
  cursor: pointer;
`;

//! Date styles
export const DatePickerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
`;

export const DatePicker = styled.div`
  flex-grow: 1;
  margin-${RV_Float}: 1rem;
`;

export const DateSpanTitle = styled.div`
  ${!RV_RTL && 'min-width: 2.6rem'};
  font-size: 1rem;
  color: #262261;
  text-transform: capitalize;
`;

//! Text styles
export const TextTitle = styled.div.attrs({
  className: C_BLACK,
})`
  font-size: 1rem;
  margin: 1rem 0;
  text-align: justify;
  text-justify: inter-word;
`;

//! Numeric styles
export const NumericWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
`;

export const Numeric = styled.div`
  flex-grow: 1;
  margin-${RV_Float}: 1rem;
`;

export const NumberSpanTitle = styled.div`
  ${!RV_RTL && 'min-width: 2.6rem'};
  font-size: 1rem;
  color: #262261;
  text-transform: capitalize;
`;

//! Node styles
export const NodeTitleWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0.5rem 0;
`;

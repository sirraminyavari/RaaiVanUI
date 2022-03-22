import styled from 'styled-components';
import { CV_DISTANT, CV_GRAY } from 'constant/CssVariables';
import { FLEX_RCB } from 'constant/StyledCommonCss';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
  height: fit-content;
`;

export const Row = styled.div`
  width: 100%;
`;

export const InputRowContainer = styled.div`
  width: 100%;
  ${FLEX_RCB};
  margin: 0.2rem 0;
`;

export const ToggleRowTitle = styled.div`
  color: ${CV_GRAY};
  font-size: 0.9rem;
`;

export const Input = styled.input.attrs({
  type: 'number',
})`
  outline: none;
  width: 5rem;
  height: 2.3rem;
  border-radius: 0.3rem;
  border: 0.0625rem solid #00deb7;
  padding: 0.4rem;
  direction: ltr;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

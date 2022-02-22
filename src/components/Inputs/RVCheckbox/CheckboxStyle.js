import styled from 'styled-components';
import { FLEX_CCC, FLEX_RCS } from 'constant/StyledCommonCss';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';

export const Input = styled.input.attrs(() => ({
  type: 'checkbox',
}))`
  display: none;
`;

export const CheckboxContainer = styled.label`
  ${FLEX_RCS};
  cursor: pointer;
  gap: 0.5rem;
`;

export const CustomCheckbox = styled.div`
  ${FLEX_CCC};
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 0.375rem;
  border: 1px solid ${CV_DISTANT};
  color: ${CV_WHITE};
  background-color: ${({ checked }) => (checked ? TCV_DEFAULT : 'transparent')};
`;

export const CheckboxLabel = styled.div`
  user-select: none;
  font-size: 0.8rem;
  font-weight: ${({ checked }) => (checked ? 500 : 400)};
  color: ${({ checked }) => (checked ? TCV_DEFAULT : CV_GRAY)};
`;

export const LabelContainer = styled.div`
  ${FLEX_RCS};
  cursor: pointer;
  gap: 0.5rem;
`;

export const Image = styled.img`
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100%;
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.5)};
  border: 0.0625rem solid
    ${({ checked }) => (checked ? TCV_DEFAULT : CV_DISTANT)};
  box-sizing: border-box;
`;

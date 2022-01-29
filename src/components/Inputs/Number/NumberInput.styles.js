import { CV_DISTANT, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import styled, { css } from 'styled-components';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import MinusIcon from 'components/Icons/MinusIcon/MinusIcon';
import RxInput from './../RxInput';

export const IconButtonStyles = css`
  display: block;
  padding-inline: 0.5rem;
  font-size: 3rem;
  cursor: pointer;
`;
export const AddIconButton = styled(AddIcon)`
  ${IconButtonStyles}
  color: ${TCV_DEFAULT};
`;
export const RemoveIconButton = styled(MinusIcon)`
  ${IconButtonStyles}
  color: ${CV_DISTANT};
`;
export const InputWrapper = styled.div.attrs({ className: 'rv-input' })`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2.56rem;
  border: 1px solid ${CV_DISTANT};
  max-width: 42rem;
  width: 100%;
  padding: 0;
  margin-inline: 0.6rem;
  background-color: ${CV_WHITE};
  transition: border 0.3s;
`;

export const CustomInput = styled(RxInput).attrs({
  type: 'number',
})`
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
  outline: none;
  border: none;
  background-color: transparent;
  height: 3rem;
  width: 100%;
  text-align: center;
  direction: ltr;

  &::placeholder {
    color: ${CV_DISTANT};
    font-size: 0.875rem;
  }
`;

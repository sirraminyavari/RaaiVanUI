import styled from 'styled-components';
import { FLEX_RCB, FLEX_RSB } from 'constant/StyledCommonCss';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';

export const Row = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

export const SelectBoxTitle = styled.div`
  margin-bottom: 0.5rem;
  color: ${CV_GRAY};
`;

export const ToggleRow = styled.div`
  ${FLEX_RCB};
  width: 100%;
  margin-bottom: 2rem;
`;
ToggleRow.displayName = 'ToggleRow';

export const ToggleRowTitle = styled.div`
  color: ${CV_GRAY};
  font-size: 0.9rem;
`;

export const ToggleRowHint = styled.p`
  text-align: justify;
  color: ${CV_DISTANT};
  font-size: 0.8rem;
  font-weight: 300;
  padding: 0.75rem 0 !important;
`;

export const InputRowContainer = styled.div`
  width: 100%;
  ${FLEX_RCB};
  margin: 0.2rem 0;
`;

export const Input = styled.input.attrs({
  type: 'number',
})`
  outline: none;
  width: 5rem;
  height: 2.5rem;
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

export const DroppableContainer = styled.div`
  width: 100%;
  margin: 1rem 0;
`;

export const OptionSelectorContainer = styled.div`
  width: 100%;
  border: 0.0625rem solid ${CV_DISTANT};
  overflow: hidden;
  height: 3rem;
  border-radius: 0.8rem;
  ${FLEX_RSB};
  margin-top: 0.625rem;
`;

export const OptionItem = styled.div`
  flex: 1;
  background-color: ${({ active }) => (!active ? CV_WHITE : TCV_DEFAULT)};
  color: ${({ active }) => (!active ? CV_GRAY : CV_WHITE)};
  text-align: center;
  line-height: 3rem;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
`;

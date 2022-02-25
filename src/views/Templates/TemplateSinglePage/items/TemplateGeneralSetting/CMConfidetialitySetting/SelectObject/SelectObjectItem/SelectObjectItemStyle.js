import styled from 'styled-components';
import { FLEX_RCB } from 'constant/StyledCommonCss';
import { CV_DISTANT, CV_GRAY } from 'constant/CssVariables';

export const ObjectListWrapper = styled.div`
  width: 100%;
  height: 14.5rem;
  overflow: auto;
`;

export const ObjectItemContainer = styled.div`
  ${FLEX_RCB};
  height: 2rem;
`;

export const InputContainer = styled.div`
  ${FLEX_RCB};
  height: 1.5rem;
  width: 100%;
  border-bottom: 0.0625rem solid ${CV_DISTANT};
  height: 1.5rem;
  margin: 0.5rem 0;
  color: ${CV_DISTANT};
  padding: 0 0.2rem;
`;

export const Input = styled.input.attrs({
  type: 'text',
})`
  outline: none;
  border: none;
  width: 100%;
  color: ${CV_GRAY};
`;

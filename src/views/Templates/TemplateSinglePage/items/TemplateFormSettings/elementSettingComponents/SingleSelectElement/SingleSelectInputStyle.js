import styled from 'styled-components';
import { CV_DISTANT, CV_GRAY, CV_GRAY_DARK } from 'constant/CssVariables';
import { FLEX_RCB, FLEX_RCS } from 'constant/StyledCommonCss';
import { Input } from '../sharedItems/SharedStyles';

export const OptionContainer = styled.div`
  ${FLEX_RCS};
  gap: 1rem;
  width: 100%;
`;

export const OptionTextContainer = styled.div`
  height: 3rem;
  border: 0.0625rem solid ${CV_DISTANT};
  border-radius: 0.312rem;
  max-width: 34rem;
  width: 100%;
  ${FLEX_RCB};
  padding: 0 0.5rem;
  gap: 0.3rem;
`;
export const OptionTextInput = styled.input.attrs({
  type: 'text',
})`
  width: 100%;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: ${CV_GRAY};
`;

export const RemoveIconButton = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  height: 2rem;
  width: 2rem;
  color: ${CV_GRAY};
`;

export const CheckboxSymbol = styled.section`
  width: 1.25rem;
  aspect-ratio: 1/1;
  border-radius: 100%;
  border: 1px solid ${CV_DISTANT};
  flex: 1.25rem;
`;

export const Separator = styled.section`
  width: 0.06rem;
  height: 2.5rem;
  background-color: ${CV_DISTANT};
`;

export const MinMaxInputContainer = styled.div`
  ${({ hasTitle }) => hasTitle && `transform: translateY(-0.75rem)`}
`;

export const MinMaxInputTitle = styled.div`
  color: ${CV_GRAY_DARK};
  text-align: center;
  font-size: 0.75rem;
  margin-bottom: 0.4rem;
`;

export const MinMaxInput = styled(Input)``;

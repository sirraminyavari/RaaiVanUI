import styled from 'styled-components';
import { CV_DISTANT, CV_GRAY } from 'constant/CssVariables';

export const SeparatorTextInfoContainer = styled.div`
  display: block;
  width: 100%;
`;

export const FieldWrapper = styled.div`
  max-width: 36rem;
  width: 100%;
  margin-bottom: 0.75rem;
`;

export const SimpleInput = styled.input`
  outline: none;
  border: none;
  border-bottom: 0.0625rem solid ${CV_DISTANT};
  color: ${CV_GRAY};
  width: 100%;
`;

export const LargeSimpleInput = styled(SimpleInput)`
  height: 1.8rem;
  font-size: 1rem;
`;

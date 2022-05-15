import styled from 'styled-components';
import { FLEX_RCB, FLEX_RSB } from 'constant/StyledCommonCss';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_RED,
  TCV_DEFAULT,
} from 'constant/CssVariables';

export const FieldsContainer = styled.div`
  ${FLEX_RSB};
  margin-top: 1rem;
`;

export const FieldWrapper = styled.div`
  max-width: 36rem;
  width: 100%;
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
  font-size: 1.12rem;
`;

export const SmallSimpleInput = styled(SimpleInput)`
  height: 1.3rem;
  font-size: 0.8rem;
  width: ${({ width }) => width || '100%'};
`;

export const SmallFieldWrapper = styled.div`
  ${FLEX_RCB};
`;

export const SmallTitle = styled.div`
  color: ${({ color }) => color};
  font-size: 0.85rem;
`;

export const FormActionContainer = styled.div`
  ${FLEX_RCB};
  gap: 1rem;
`;

export const ActionButton = styled.button`
  ${FLEX_RCB};
  outline: none;
  border: none;
  height: 2.5rem;
  line-height: 2.5rem;
  gap: 0.5rem;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
`;

export const DeleteActionButton = styled(ActionButton)`
  color: ${CV_RED};
`;

export const DuplicateActionButton = styled(ActionButton)`
  color: ${TCV_DEFAULT};
`;

export const Separator = styled.div`
  &::before {
    content: '';
    border-right: 0.0625rem solid ${CV_DISTANT};
  }
`;

export const SelectBoxContainer = styled.div`
  max-width: 21rem;
  width: 100%;
`;

export const SelectBoxTitle = styled.div`
  color: ${CV_GRAY};
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

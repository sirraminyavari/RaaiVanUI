import styled from 'styled-components';
import { FLEX_RCS } from '../../../../../../constant/StyledCommonCss';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_GRAY_LIGHT,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
} from '../../../../../../constant/CssVariables';

export const CodingPatternContainer = styled.div`
  ${FLEX_RCS};
  gap: 1rem;
`;

export const EditButton = styled.button`
  height: 3rem;
  background-color: ${CV_WHITE};
  color: ${TCV_DEFAULT};
  font-weight: 500;
  padding: 0 1rem;
  border-radius: 0.5rem;
  min-width: 8rem;
  border: 0.0625rem solid transparent;
  transition: border 0.15s ease-out;

  &:hover {
    border: 0.0625rem solid ${TCV_DEFAULT};
  }
`;
export const InputData = styled.div`
  height: 3rem;
  max-width: 56rem;
  width: 100%;
  border: 0.0625rem solid ${CV_DISTANT};
  border-radius: 0.5rem;
  padding: 0 0.5rem;
  ${FLEX_RCS};
  gap: 0.5rem;
  background-color: ${CV_WHITE};
`;

export const Item = styled.div`
  background-color: ${CV_GRAY_LIGHT};
  color: ${CV_GRAY};
  font-size: 0.8rem;
  ${FLEX_RCS};
  gap: 0.5rem;
  height: 2rem;
  padding: 0 0.5rem;
  border-radius: 0.5rem;
`;

export const RemoveIconButton = styled.button`
  height: 1.5rem;
  width: 1.5rem;
  border: none;
  background-color: transparent;
  color: ${CV_RED};
`;

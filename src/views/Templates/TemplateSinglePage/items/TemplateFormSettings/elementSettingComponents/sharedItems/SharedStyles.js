import styled from 'styled-components';
import { FLEX_RCB } from 'constant/StyledCommonCss';
import { CV_DISTANT, CV_GRAY } from 'constant/CssVariables';

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

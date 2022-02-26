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

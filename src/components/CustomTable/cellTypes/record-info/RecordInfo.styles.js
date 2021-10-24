import { CV_DISTANT } from 'constant/CssVariables';
import { FLEX_CEC, FLEX_RCE } from 'constant/StyledCommonCss';
import styled from 'styled-components';

export const RecordInfoContainer = styled.div`
  width: 100%;
  padding: 0 1rem;
  ${FLEX_RCE}
  gap: 1rem;

  .record-info-avatar {
    width: 2.8rem;
    height: 2.8rem;
    min-width: 2.8rem;
    min-height: 2.8rem;
    border: none;
  }
`;

export const RecordInfoWrapper = styled.div`
  font-size: 1rem;
  ${FLEX_CEC}
`;

export const RecordInfoDate = styled.span`
  display: inline-block;
  min-width: max-content;
`;

export const RecordInfoTimeSpan = styled.span`
  font-size: 0.85rem;
  color: ${CV_DISTANT};
`;

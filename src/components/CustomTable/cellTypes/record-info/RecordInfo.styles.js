import { FLEX_RCB } from 'constant/StyledCommonCss';
import styled from 'styled-components';

export const RecordInfoContainer = styled.div`
  width: 100%;
  padding: 0 1rem;
  ${FLEX_RCB}
  gap: 1rem;

  .record-info-avatar {
    width: 2.8rem;
    min-width: 2.8rem;
    height: 2.7rem;
  }
`;

export const RecordInfoWrapper = styled.div`
  font-size: 0.9rem;
`;

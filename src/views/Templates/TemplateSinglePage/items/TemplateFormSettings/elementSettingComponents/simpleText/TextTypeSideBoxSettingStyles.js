import styled from 'styled-components';
import { FLEX_RCB } from 'constant/StyledCommonCss';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.8rem;
`;

export const ToggleRow = styled.div`
  ${FLEX_RCB};
  width: 100%;
`;

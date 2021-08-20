import { FLEX_RCC } from 'constant/StyledCommonCss';
import styled from 'styled-components';

export const BadgeWrapper = styled.div`
  height: 1.5rem;
  width: 1.5rem;
  ${FLEX_RCC}
  border-radius: 50%;
  text-align: center;
  font-size: ${({ length }) => (length < 3 ? '60%' : '50%')};
  direction: rtl;
`;

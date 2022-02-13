import styled from 'styled-components';
import { BG_GRAY_LIGHT, C_GRAY } from 'constant/Colors';

export const HeaderContainer = styled.div.attrs({
  className: BG_GRAY_LIGHT,
})`
  padding: 0;
  margin: 0;
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.span.attrs({
  className: C_GRAY,
})`
  font-size: 1.1rem;
  font-weight: 500;
`;

import {
  TBO_WARM,
  C_DISTANT,
  C_WHITE,
  C_RED,
  BO_GRAY,
  C_GRAY,
} from 'constant/Colors';
import styled from 'styled-components';

export const TableContainer = styled.div`
  padding: 1rem 0;
  display: grid;
  height: 100vh;
  overflow: scroll;
  grid-gap: 0.25rem;
  grid-template-rows: 1fr 1fr 1fr 1fr;
`;

export const TableHeader = styled.div.attrs({
  className: `${C_GRAY}`,
})`
  font-size: 0.8rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--rv-gray-color);
`;
export const TableRowHeader = styled.div.attrs({
  className: `${C_GRAY}`,
})`
  display: grid;
  grid-template-columns: 2fr 2fr 2fr;
  font-size: 0.8rem;
  padding: 0.5rem;
`;
export const TRow = styled.div.attrs({ className: `${C_GRAY}` })`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  font-size: 0.8rem;
  padding: 0.5rem;
  border-bottom: 1px solid var(--rv-gray-color);
  &:hover {
    cursor: pointer;
  }
`;

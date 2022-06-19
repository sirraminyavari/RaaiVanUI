import { C_GRAY } from 'constant/Colors';
import styled from 'styled-components';

export const TableContainer = styled.div`
  padding: 1rem 0;
  display: grid;
  height: 100vh;
  overflow: scroll;
  grid-gap: 0.25rem;
  grid-template-rows: repeat(5, 1fr);
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
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
  grid-area: content;

  text-align: center;
  align-items: center;
  font-size: 0.75rem;
  justify-content: center;
  padding: 0rem;
`;
export const TRow = styled.div.attrs({ className: `${C_GRAY}` })`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-area: content;

  width: 100%;
  font-size: 0.78rem;
  padding: 0rem;
  text-align: center;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--rv-gray-color);
  &:hover {
    cursor: pointer;
  }
`;

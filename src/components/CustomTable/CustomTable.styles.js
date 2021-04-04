import styled from 'styled-components';

export const TableContainer = styled.div`
  padding: 1rem;
  display: block;
  overflow-x: auto;
  margin: 1rem;
  max-width: 100%;
  border: 0.15rem solid black;
  border-radius: 1rem;

  table {
    width: 100%;
    border-spacing: 0;
    border: 0.15rem solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      min-width: 7rem;
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      text-align: center;

      :first-child {
        border-right: 0;
      }
    }
  }
`;

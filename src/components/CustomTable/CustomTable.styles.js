import styled from 'styled-components';

export const TableContainer = styled.div`
  padding: 1rem;
  display: block;
  margin: 1rem;
  border: 0.15rem solid black;

  .table {
    border-spacing: 0;
    border: 0.15rem solid black;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 0.5rem 0;

    .tbody {
      min-height: 2rem;
    }

    .footer {
      tr:first-child {
        td {
          border-top: 2px solid black;
          min-height: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 0.5rem;
        }
      }
      font-weight: bolder;
      text-align: center;
    }

    .tr {
      :hover {
        background-color: #bbb;
        color: black;
      }

      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    .th {
      font-weight: bold;
      font-size: 0.95rem;
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      border-left: 1px solid black;
      text-align: center;
      position: relative;

      .resizer {
        display: inline-block;
        background: gray;
        width: 0.2rem;
        height: 100%;
        border-radius: 10%;
        position: absolute;
        left: 0;
        top: 0;
        transform: translateX(-50%);
        z-index: 1;
        ${'' /* prevents from scrolling while dragging on touch devices */}
        touch-action:none;

        &.isResizing {
          background: black;
        }
      }

      :first-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
    display: flex;
    justify-content: end;
    align-items: center;
  }

  .middle {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Tr = styled.div`
  background-color: ${({ isDragging }) => (isDragging ? '#333' : '')};
  color: ${({ isDragging }) => (isDragging ? '#fff' : '')};
`;

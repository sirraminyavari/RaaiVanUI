import styled from 'styled-components';

export const TableContainer = styled.div`
  padding: 1rem;
  display: block;
  margin: 1rem;
  max-width: 100%;
  border: 0.15rem solid black;

  .table {
    width: 100%;
    border-spacing: 0;
    border: 0.15rem solid black;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 0.5rem 0;

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

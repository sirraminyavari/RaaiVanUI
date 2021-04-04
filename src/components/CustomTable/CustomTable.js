import { useMemo } from 'react';
import { useTable } from 'react-table';
import * as Styled from './CustomTable.styles';
import EditableCell from './EditableCell';

const CustomTable = ({ columns, data, updateCellData }) => {
  const defaultColumn = useMemo(
    () => ({
      // And also our default editable cell
      Cell: EditableCell,
    }),
    []
  );

  //! Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    defaultColumn,
    updateCellData,
  });

  //! Render the UI for your table
  return (
    <Styled.TableContainer>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps({
                  className: i % 2 === 0 ? 'SoftBackgroundColor' : '',
                })}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.render('Cell', { editable: true })}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Styled.TableContainer>
  );
};

export default CustomTable;

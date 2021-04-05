import { useMemo } from 'react';
import { useTable, useBlockLayout, useResizeColumns } from 'react-table';
import * as Styled from './CustomTable.styles';
import EditableCell from './EditableCell';
import Button from 'components/Buttons/Button';

const CustomTable = ({ columns, data, updateCellData }) => {
  const defaultColumn = useMemo(
    () => ({
      minWidth: 100,
      width: 150,
      maxWidth: 500,
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
    resetResizing,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      updateCellData,
    },
    useBlockLayout,
    useResizeColumns
  );

  //! Render the UI for your table
  return (
    <Styled.TableContainer>
      <Button
        style={{ display: 'inline-block' }}
        disable={false}
        onClick={resetResizing}>
        Reset Resizing
      </Button>
      <div {...getTableProps()} className="table">
        <div>
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column) => (
                <div {...column.getHeaderProps()} className="th">
                  {column.render('Header')}
                  <div
                    {...column.getResizerProps()}
                    className={`resizer ${
                      column.isResizing ? 'isResizing' : ''
                    }`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <div
                {...row.getRowProps({})}
                className={`${i % 2 === 0 ? 'SoftBackgroundColor' : ''} tr`}>
                {row.cells.map((cell) => {
                  return (
                    <div {...cell.getCellProps()} className="td">
                      {cell.render('Cell', { editable: true })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </Styled.TableContainer>
  );
};

export default CustomTable;

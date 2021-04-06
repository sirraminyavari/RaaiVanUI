import { useMemo, useState } from 'react';
import { useTable, useBlockLayout, useResizeColumns } from 'react-table';
import * as Styled from './CustomTable.styles';
import EditableCell from './EditableCell';
import Button from 'components/Buttons/Button';
import DeleteRowIcon from 'components/Icons/DeleteRowIcon/DeleteRowIcon';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';

const defaultPropGetter = () => ({});

const CustomTable = ({
  editable: isEditable,
  columns,
  data,
  updateCellData,
  getCellProps = defaultPropGetter,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
}) => {
  const [selectedCell, setSelectedCell] = useState(null);

  const renderCell = (cell) => {
    switch (cell.column.dataType) {
      case 'date':
        return cell.render(
          <CustomDatePicker label="انتخاب تاریخ" value={cell.value} />
        );
      default:
        return cell.render('Cell', { editable: !!isEditable });
    }
  };

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
      selectedCell,
      setSelectedCell,
    },
    useBlockLayout,
    useResizeColumns,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        //! Make a column for deletion
        {
          id: 'deletion',
          dataType: 'actions',
          Header: () => <div>اقدامات</div>,
          Cell: ({ row }) => (
            <div className="middle">
              <DeleteRowIcon
                style={{ cursor: 'pointer' }}
                onClick={() => console.log(row)}
                size={25}
              />
            </div>
          ),
          width: 60,
        },
        ...columns,
      ]);
    }
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
                <div
                  {...column.getHeaderProps([
                    getColumnProps(column),
                    getHeaderProps(column),
                  ])}
                  className="th">
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
                {...row.getRowProps(getRowProps(row))}
                className={`${i % 2 === 0 ? 'SoftBackgroundColor' : ''} tr`}>
                {row.cells.map((cell) => {
                  return (
                    <div
                      {...cell.getCellProps([
                        {
                          ...getCellProps(cell),
                          ...getColumnProps(cell.column),
                          onClick: () => setSelectedCell(cell),
                        },
                      ])}
                      className="td">
                      {renderCell(cell)}
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

import { useMemo, useState } from 'react';
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useSortBy,
} from 'react-table';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as Styled from './CustomTable.styles';
import EditableCell from './EditableCell';
import Button from 'components/Buttons/Button';
import DeleteRowIcon from 'components/Icons/DeleteRowIcon/DeleteRowIcon';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import Arrow from 'components/Icons/ArrowIcons/Arrow';

const defaultPropGetter = () => ({});

const CustomTable = ({
  editable: isEditable,
  columns,
  data,
  updateCellData,
  reorderData,
  getCellProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
}) => {
  const [selectedCell, setSelectedCell] = useState(null);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    reorderData(source.index, destination.index);
  };

  const renderCell = (cell) => {
    switch (cell.column.dataType) {
      case 'date':
        console.log(cell);
        return cell.render(
          <CustomDatePicker
            label="انتخاب تاریخ"
            mode="input"
            type="jalali"
            range={false}
            size="small"
            value={cell.value}
          />
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
      reorderData,
    },
    useBlockLayout,
    useResizeColumns,
    useSortBy,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        //! Make a column for deletion
        {
          id: 'deletion',
          dataType: 'actions',
          Header: () => <div>اقدامات</div>,
          Cell: ({ row }) => (
            <DeleteRowIcon
              style={{ cursor: 'pointer' }}
              onClick={() => console.log(row)}
              size={25}
            />
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
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="th">
                  <Styled.HeaderWrapper>
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <Arrow dir="down" size={20} />
                        ) : (
                          <Arrow dir="up" size={20} />
                        )
                      ) : (
                        ''
                      )}
                    </span>
                  </Styled.HeaderWrapper>
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="table-body">
            {(provided, _) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <Draggable
                      draggableId={row.original.id}
                      key={row.original.id}
                      index={row.index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          isDragging={snapshot.isDragging}
                          {...row.getRowProps(getRowProps(row))} //! react-table props always must come after dnd props to work properly
                          className={`${
                            i % 2 === 0 ? 'SoftBackgroundColor' : ''
                          } tr`}>
                          {row.cells.map((cell) => (
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
                          ))}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </Styled.TableContainer>
  );
};

export default CustomTable;

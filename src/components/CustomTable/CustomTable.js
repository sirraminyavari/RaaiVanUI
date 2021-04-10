import { useMemo, useState } from 'react';
import {
  useTable,
  useFlexLayout,
  useResizeColumns,
  useSortBy,
} from 'react-table';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as Styled from './CustomTable.styles';
// import EditableCell from './EditableCell';
import Button from 'components/Buttons/Button';
// import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import Arrow from 'components/Icons/ArrowIcons/Arrow';

const defaultPropGetter = () => ({});

const CustomTable = ({
  editable: isEditable,
  columns,
  data,
  updateCellData,
  removeRow,
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

  const defaultColumn = useMemo(
    () => ({
      minWidth: 100,
      width: 150,
      maxWidth: 500,
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
      removeRow,
      selectedCell,
      setSelectedCell,
      reorderData,
    },
    useFlexLayout,
    useResizeColumns,
    useSortBy
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
            <div {...headerGroup.getHeaderGroupProps()}>
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
                        <Styled.Tr
                          ref={provided.innerRef}
                          isSomethingDragging={snapshot.draggingOver}
                          isDragging={snapshot.isDragging}
                          {...provided.dragHandleProps}
                          {...row.getRowProps({
                            ...getRowProps(row),
                            ...provided.draggableProps,
                          })} //! react-table props always must come after dnd props to work properly
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
                              {cell.render('Cell', { editable: !!isEditable })}
                            </div>
                          ))}
                        </Styled.Tr>
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

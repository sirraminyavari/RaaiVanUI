import { useMemo, useState, useEffect } from 'react';
import {
  useTable,
  useFlexLayout,
  useResizeColumns,
  useSortBy,
  usePagination,
} from 'react-table';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as Styled from './CustomTable.styles';
import Button from 'components/Buttons/Button';
import Arrow from 'components/Icons/ArrowIcons/Arrow';
import Pagination from './Pagination';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import Confirm from 'components/Modal/Confirm';
import H5 from 'components/TypoGraphy/H5';
import Modal from 'components/Modal/Modal';

const defaultPropGetter = () => ({});

const CustomTable = ({
  editable: isEditable,
  isFetching,
  columns,
  data,
  updateCellData,
  removeRow,
  removeAll,
  addRow,
  reorderData,
  getCellProps = defaultPropGetter,
}) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [confirm, setConfirm] = useState({
    show: false,
    message: '',
    type: '',
  });
  const [modal, setModal] = useState({ show: false, title: '', type: '' });
  const [showFooter, setShowFooter] = useState(false);

  const restoreConfirmState = () => {
    setConfirm({
      show: false,
      message: '',
      type: '',
    });
  };

  const restoreModalState = () => {
    setModal({
      show: false,
      title: '',
      type: '',
    });
  };

  useEffect(() => {
    if (!selectedCell) return;
    if (selectedCell.column.id === 'delete-row') {
      console.log(selectedCell);
      setConfirm({
        show: true,
        message: `آیا از پاک کردن ردیف شماره ${
          selectedCell.row.index + 1
        } اطمینان دارید؟`,
        type: 'deleteRow',
      });
    }
    if (selectedCell.column.id === 'view-row') {
      console.log(selectedCell);
      setModal({
        show: true,
        type: 'view-row',
        title: 'نمایش جزئیات ردیف',
      });
    }
  }, [selectedCell]);

  const getModalContent = () => {
    let viewColumns = columns.filter((column) => {
      return Object.keys(column).includes('Header');
    });
    return selectedCell?.row.original[viewColumns[0].accessor];
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    reorderData(source.index, destination.index);
  };

  const handleClearAll = () => {
    setConfirm({
      show: true,
      message: `آیا از پاک کردن تمام جدول اطمینان دارید؟`,
      type: 'clearAll',
    });
  };

  const handleOnConfirm = () => {
    switch (confirm.type) {
      case 'clearAll':
        restoreConfirmState();
        removeAll();
        return;
      case 'deleteRow':
        restoreConfirmState();
        removeRow(selectedCell.row.index);
        return;

      default:
        restoreConfirmState();
        return;
    }
  };

  const handleOnCancel = () => {
    restoreConfirmState();
  };

  const handleOnModalClose = () => {
    restoreModalState();
  };

  const defaultColumn = useMemo(
    () => ({
      minWidth: 40,
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
    footerGroups,
    prepareRow,
    page,
    resetResizing,
    canPreviousPage, //! Pagination
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }, //! End of Pagination
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      updateCellData,
      removeRow,
      removeAll,
      addRow,
      selectedCell,
      setSelectedCell,
      reorderData,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useFlexLayout,
    useResizeColumns,
    useSortBy,
    usePagination
  );

  const handleAddRow = () => {
    setShowFooter(true);
  };

  const handleFooterClick = (column) => {
    if (column.dataType === 'actions') {
      if (column.index === 0) {
        console.log('accept');
        addRow();

        setTimeout(() => {
          gotoPage(pageCount - 1);
          setShowFooter(false);
        }, 500);
      } else {
        console.log('reject');
        setShowFooter(false);
      }
    }
  };

  //! Render the UI for your table
  return (
    <Styled.TableContainer>
      <Confirm
        show={confirm.show}
        onConfirm={handleOnConfirm}
        onCancel={handleOnCancel}
        onClose={handleOnCancel}>
        <H5>{confirm.message}</H5>
      </Confirm>
      <Modal
        contentWidth="75%"
        show={modal.show}
        title={modal.title}
        onClose={handleOnModalClose}>
        {getModalContent()}
      </Modal>
      <div>
        <Button style={{ display: 'inline-block' }} onClick={resetResizing}>
          Reset Resizing
        </Button>
        <Button style={{ display: 'inline-block' }} onClick={handleAddRow}>
          Add new record
        </Button>
        <Button
          style={{ display: 'inline-block' }}
          type="negative"
          onClick={handleClearAll}>
          Clear all
        </Button>
      </div>
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
                className="tbody"
                ref={provided.innerRef}
                {...provided.droppableProps}
                {...getTableBodyProps()}>
                {page.map((row, i) => {
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
                {isFetching && <LogoLoader />}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {showFooter && (
          <div className="footer">
            {footerGroups.map((group) => (
              <tr {...group.getFooterGroupProps()}>
                {group.headers.map((column) => (
                  <td
                    {...column.getFooterProps({
                      onClick: () => handleFooterClick(column),
                    })}>
                    {column.render('Footer')}
                  </td>
                ))}
              </tr>
            ))}
          </div>
        )}
      </div>
      <Pagination
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
        gotoPage={gotoPage}
        nextPage={nextPage}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageOptions={pageOptions}
        pageSize={pageSize}
        previousPage={previousPage}
        setPageSize={setPageSize}
      />
    </Styled.TableContainer>
  );
};

export default CustomTable;

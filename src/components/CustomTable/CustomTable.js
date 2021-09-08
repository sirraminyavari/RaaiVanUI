import { useMemo, useState, useEffect, memo } from 'react';
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
// import DragIcon from 'components/Icons/DragIcon/Drag';
// import TrashIcon from 'components/Icons/TrashIcon/Trash';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import Pagination from './Pagination';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import Confirm from 'components/Modal/Confirm';
import H5 from 'components/TypoGraphy/H5';
import Modal from 'components/Modal/Modal';
import { CV_DISTANT, CV_GRAY_DARK, CV_RED } from 'constant/CssVariables';

const defaultPropGetter = () => ({});

/**
 * @typedef PropType
 * @type {Object}
 * @property {boolean} editable - If true table cells are editable.
 * @property {boolean} isFetching - A flag that indecates that if table's data are provided or not.
 * @property {object} columns - The core columns configuration object for the entire table.
 * @property {array} data - The data array that you want to display on the table.
 */

/**
 *  @description Renders a custom table component.
 * @component
 * @param {PropType} props -Props that passed to custom table.
 */
const CustomTable = (props) => {
  //! Properties that passed to custom table component.
  const {
    editable: isEditable,
    resizable: isResizable,
    isFetching,
    columns,
    data,
    updateCellData,
    removeRow,
    removeAll,
    addRow,
    pagination,
    reorderData,
    getCellProps = defaultPropGetter,
  } = props;

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

  // const handleClearAll = () => {
  //   setConfirm({
  //     show: true,
  //     message: `آیا از پاک کردن تمام جدول اطمینان دارید؟`,
  //     type: 'clearAll',
  //   });
  // };

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
      // minWidth: 40,
      // width: 150,
      // maxWidth: 500,
    }),
    []
  );
  const pageSize = pagination?.perPageCount?.[0] || 15;
  const reachedPaginationThreshold = data?.length > pageSize;

  const paginationStates = useMemo(() => {
    return !!pagination
      ? {
          pageIndex: pagination?.initialPageIndex || 0,
          pageSize: pageSize,
        }
      : {};
  }, []);

  //! Use the state and functions returned from useTable to build your UI.
  //! Every option you pass to useTable should be memoized either via React.useMemo (for objects) or React.useCallback (for functions).
  const tableInstance = useTable(
    {
      columns, //! Must be memoized (Based on official Docs.).
      data, //! Must be memoized.
      defaultColumn,
      updateCellData,
      removeRow,
      removeAll,
      addRow,
      selectedCell,
      setSelectedCell,
      reorderData,
      initialState: {
        ...paginationStates,
      },
    },
    useFlexLayout,
    useResizeColumns,
    useSortBy,
    usePagination
  );

  tableInstance.state = {
    ...tableInstance.state,
    showFooter,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    prepareRow,
    page,
    resetResizing,
    // state,
  } = tableInstance;

  // console.log(state);

  const handleAddRow = () => {
    setShowFooter(true);
  };

  const handleFooterClick = (column) => {
    if (column.dataType === 'actions') {
      if (column.index === 0) {
        console.log('accept');
        addRow();
        setShowFooter(false);
        // gotoPage(pageCount - 1);
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
      <Styled.Table {...getTableProps()}>
        <div>
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Styled.TableHeader
                  {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <Styled.HeaderWrapper canSort={column.canSort}>
                    {column.render('Header')}
                    <>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <Arrow
                            dir="down"
                            color={CV_GRAY_DARK}
                            size={24}
                            className="table-sort-arrow"
                          />
                        ) : (
                          <Arrow
                            dir="up"
                            color={CV_GRAY_DARK}
                            size={24}
                            className="table-sort-arrow"
                          />
                        )
                      ) : (
                        column.canSort && (
                          <Arrow
                            dir="up-down"
                            color={CV_DISTANT}
                            size={24}
                            className="table-sort-arrow"
                          />
                        )
                      )}
                    </>
                  </Styled.HeaderWrapper>
                  {isResizable && (
                    <Styled.TableColumnResizer
                      isResizing={column.isResizing}
                      {...column.getResizerProps()}
                    />
                  )}
                </Styled.TableHeader>
              ))}
            </div>
          ))}
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="table-body">
            {(provided, _) => (
              <Styled.TableBody
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
                          {...row.getRowProps({
                            ...provided.draggableProps,
                          })} //! react-table props always must come after dnd props to work properly
                        >
                          <>
                            {row.cells.map((cell) => (
                              <Styled.TableCell
                                {...cell.getCellProps([
                                  {
                                    ...getCellProps(cell),
                                    onClick: () => setSelectedCell(cell),
                                  },
                                ])}>
                                {cell.render('Cell', {
                                  editable: !!isEditable,
                                  dragHandleProps: {
                                    ...provided.dragHandleProps,
                                  },
                                })}
                              </Styled.TableCell>
                            ))}
                            {/* <Styled.RowDragHandle {...provided.dragHandleProps}>
                              <DragIcon />
                            </Styled.RowDragHandle>
                            <Styled.RowActionHandle
                              onClick={() => console.log('Delete row')}>
                              <TrashIcon color={CV_DISTANT} />
                            </Styled.RowActionHandle> */}
                          </>
                        </Styled.Tr>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
                {isFetching && <LogoLoader />}
              </Styled.TableBody>
            )}
          </Droppable>
        </DragDropContext>
        {showFooter && (
          <Styled.FooterContainer>
            {footerGroups.map((group) => (
              <Styled.FooterTr {...group.getFooterGroupProps()}>
                {group.headers.map((column) => (
                  <div
                    className="footer-td"
                    {...column.getFooterProps({
                      onClick: () => handleFooterClick(column),
                    })}>
                    {column.render('Footer')}
                  </div>
                ))}
                <Styled.RowActionHandle
                  style={{ left: '-1.7rem' }}
                  onClick={() => setShowFooter(false)}>
                  <CloseIcon size={20} color={CV_RED} />
                </Styled.RowActionHandle>
              </Styled.FooterTr>
            ))}
          </Styled.FooterContainer>
        )}
      </Styled.Table>
      {!!pagination && reachedPaginationThreshold && (
        <Pagination tableInstance={tableInstance} pagination={pagination} />
      )}
      <Styled.TableButtonsContainer>
        <Button
          style={{ display: 'inline-block', margin: '0 0.5rem' }}
          onClick={resetResizing}>
          Reset Resizing
        </Button>
        <Button
          type="primary-o"
          classes="table-add-row-button"
          onClick={handleAddRow}>
          ایجاد موضوع جدید
        </Button>
        {/* <Button
          style={{ display: 'inline-block' }}
          type="negative"
          onClick={handleClearAll}>
          Clear all
        </Button> */}
      </Styled.TableButtonsContainer>
    </Styled.TableContainer>
  );
};

export default memo(CustomTable);

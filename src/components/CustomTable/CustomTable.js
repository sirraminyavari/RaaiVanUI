import { useMemo, useState, memo, lazy, Suspense } from 'react';
import {
  useTable,
  useFlexLayout,
  useResizeColumns,
  useSortBy,
  usePagination,
} from 'react-table';
import { useSticky } from 'react-table-sticky';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as Styled from './CustomTable.styles';
import Pagination from './Pagination';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import TableAction from './TableAction';
import ModalFallbackLoader from 'components/Loaders/ModalFallbackLoader/ModalFallbackLoader';
import ColumnHeader from './ColumnHeader';

const TableModal = lazy(() =>
  import(/* webpackChunkName: "table-modal"*/ 'components/Modal/Modal')
);

const defaultPropGetter = () => ({});
const DEFAULT_MODAL_PROPS = { show: false, title: '', type: '', content: null };

/**
 * @typedef PropType
 * @type {Object}
 * @property {string} tableId - The id of the table.
 * @property {boolean} editable - If true table cells are editable.
 * @property {boolean} isLoading - A flag that indicates if table data is loading or not.
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
    isLoading,
    columns,
    data,
    onCellChange,
    removeRow,
    editRow,
    addRow,
    onEditRowStart,
    onEditRowCancel,
    pagination,
    reorderRow,
    onSearch,
    tableId,
    getColumnsOption,
    getCellProps = defaultPropGetter,
  } = props;

  const [selectedCell, setSelectedCell] = useState(null);
  const [isRowDragging, setIsRowDragging] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [modal, setModal] = useState(DEFAULT_MODAL_PROPS);
  const [showFooter, setShowFooter] = useState(false);

  const restoreModalState = () => {
    setModal(DEFAULT_MODAL_PROPS);
  };

  // const getModalContent = (modalType) => {
  //   switch (modalType) {
  //     case modalTypes.table:
  //       return <div>Table</div>;

  //     default:
  //       return <div>Modal Content</div>;
  //   }
  // };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    setIsRowDragging(false);
    if (!destination) return;
    reorderRow(source.index, destination.index);
  };

  const handleBeforeDragStart = () => {
    setIsRowDragging(true);
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
      onCellChange,
      removeRow,
      editRow,
      addRow,
      selectedCell,
      setSelectedCell,
      modal,
      setModal,
      editingRow,
      onEditRowStart,
      onEditRowCancel,
      setEditingRow,
      setShowFooter,
      reorderRow,
      getColumnsOption,
      tableId,
      initialState: {
        ...paginationStates,
      },
    },
    useFlexLayout,
    useResizeColumns,
    useSortBy,
    usePagination,
    useSticky
  );

  tableInstance.state = {
    ...tableInstance.state,
    showFooter,
    data,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    prepareRow,
    page,
    // resetResizing,
    // state,
  } = tableInstance;

  // console.log(state);

  const handleAddRow = () => {
    setShowFooter(true);
  };

  //! Render the UI for your table
  return (
    <Styled.TableContainer>
      <TableAction onAddRow={handleAddRow} onSearch={onSearch} />
      <Suspense fallback={<ModalFallbackLoader />}>
        {modal.show && (
          <TableModal
            contentWidth="75%"
            show={modal.show}
            title={modal.title}
            onClose={handleOnModalClose}>
            {!!modal.content && modal.content()}
          </TableModal>
        )}
      </Suspense>
      <Styled.TableWrapper>
        {!isLoading && (
          <Styled.Table {...getTableProps()}>
            <div>
              {headerGroups.map((headerGroup) => (
                <div {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Styled.TableHeader
                      {...column.getHeaderProps(column.getSortByToggleProps())}>
                      <ColumnHeader column={column} allColumns={columns} />
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
            <DragDropContext
              onDragEnd={handleDragEnd}
              onBeforeDragStart={handleBeforeDragStart}>
              <Droppable droppableId={tableId}>
                {(provided, _) => (
                  <Styled.TableBody
                    isRowDragging={isRowDragging}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    {...getTableBodyProps()}>
                    {page.map((row, i) => {
                      prepareRow(row);
                      const isRowEditing = row.original.id === editingRow;
                      return (
                        <Draggable
                          draggableId={row.original.id}
                          key={row.original.id}
                          index={row.index}
                          isDragDisabled={isRowEditing}>
                          {(provided, snapshot) => (
                            <Styled.Tr
                              ref={provided.innerRef}
                              isDraggingOver={snapshot.draggingOver}
                              isDragging={snapshot.isDragging}
                              isEditing={isRowEditing}
                              {...row.getRowProps({
                                ...provided.draggableProps,
                              })} //! react-table props always must come after dnd props to work properly
                            >
                              <>
                                {row.cells.map((cell) => {
                                  return (
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
                                  );
                                })}
                              </>
                            </Styled.Tr>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Styled.TableBody>
                )}
              </Droppable>
            </DragDropContext>
            {showFooter && (
              <Styled.FooterContainer>
                {footerGroups.map((group) => (
                  <Styled.FooterTr {...group.getFooterGroupProps()}>
                    {group.headers.map((column) => {
                      return (
                        <div className="footer-td" {...column.getFooterProps()}>
                          {column.render('Footer')}
                        </div>
                      );
                    })}
                  </Styled.FooterTr>
                ))}
              </Styled.FooterContainer>
            )}
          </Styled.Table>
        )}
      </Styled.TableWrapper>
      {isLoading && <LogoLoader />}
      {!!pagination && reachedPaginationThreshold && !isLoading && (
        <Pagination tableInstance={tableInstance} pagination={pagination} />
      )}
    </Styled.TableContainer>
  );
};

export default memo(CustomTable);

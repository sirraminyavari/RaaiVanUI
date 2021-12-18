//! Recommendation: https://react-table.tanstack.com/docs/overview

import { useMemo, useState, memo, lazy, Suspense, useEffect } from 'react';
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
import { getUUID } from 'helpers/helpers';

const TableModal = lazy(() =>
  import(/* webpackChunkName: "table-modal"*/ 'components/Modal/Modal')
);

const defaultPropGetter = () => ({});
const DEFAULT_MODAL_PROPS = { show: false, title: '', type: '', content: null };

/**
 * @typedef PaginationType
 * @type {Object}
 * @property {Number[]} perPageCount
 * @property {Number} initialPageIndex
 */

/**
 * @typedef PropType
 * @type {Object}
 * @property {String} tableId - The id of the table.
 * @property {Boolean} editable - If true table cells are editable.
 * @property {Boolean} resizable - If true table columns are resizable.
 * @property {Boolean} editByCell - If true every single cell can be edited.
 * @property {Boolean} isLoading - A flag that indicates if table data is loading or not.
 * @property {Object} columns - The core columns configuration object for the entire table.
 * @property {Array} data - The data array to display on the table.
 * @property {Function} onCellChange - A callback function that fires every time cell content changes.
 * @property {Function} onCreateNewRow - A callback function to create new row instance.
 * @property {Function} removeRow - A callback function to remove a row record.
 * @property {Function} editRow - A callback function to edit a row record.
 * @property {Function} addRow - A callback function to add new row.
 * @property {Function} onEditRowStart - A callback function that fires on row edit start.
 * @property {Function} onEditRowCancel - A callback function that fires when edit row has been canceled.
 * @property {Function} onDuplicateRow - A callback function that duplicates a row record.
 * @property {Function} reorderRow - A callback function that re-orders row records.
 * @property {Function} onSearch - A callback function that search among row records content.
 * @property {PaginationType} pagination - A callback function that duplicates a row record.
 * @property {any} tableMirror - An instance of the table itself.
 * @property {Function} getColumnsOption - A callback that gets necessary options for the table.
 */

/**
 *  @description Renders a custom table component.
 * @component
 * @param {PropType} props -Props that passed to custom table.
 */
const CustomTable = (props) => {
  //! Properties that passed to custom table component.
  const {
    tableId,
    editable: isTableEditable,
    resizable: isTableResizable,
    editByCell,
    isLoading,
    columns,
    data,
    onCellChange,
    onCreateNewRow,
    removeRow,
    editRow,
    addRow,
    onEditRowStart,
    onEditRowCancel,
    onDuplicateRow,
    pagination,
    reorderRow,
    onSearch,
    tableMirror,
    getColumnsOption,
    getCellProps = defaultPropGetter,
  } = props;

  const [selectedCell, setSelectedCell] = useState(null);
  const [isRowDragging, setIsRowDragging] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [modal, setModal] = useState(DEFAULT_MODAL_PROPS);
  const [tempRowId, setTempRowId] = useState(null);

  const restoreModalState = () => {
    setModal(DEFAULT_MODAL_PROPS);
  };

  //! Enable add new row button whenever the new row has been created.
  useEffect(() => {
    let hasNewRow = data?.some((row) => row?.id?.substr()?.includes('new'));

    if (!hasNewRow) {
      setTempRowId(null);
    }
  }, [data]);

  //! Execute row re-order on drag end.
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
  //! Credit: https://react-table.tanstack.com/docs/api/overview#option-memoization
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
      editingRowId,
      onEditRowStart,
      onEditRowCancel,
      onDuplicateRow,
      setEditingRowId,
      reorderRow,
      tempRowId,
      setTempRowId,
      getColumnsOption,
      tableId,
      tableMirror,
      editByCell,
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
    data,
    lastRowInPage: tableInstance?.page?.[tableInstance?.page.length - 1],
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    // resetResizing,
    // state,
  } = tableInstance;

  // console.log(state);

  //! Fires on add new row.
  const handleAddItem = () => {
    if (!tempRowId) {
      let tempRowId = 'new_' + getUUID();
      setTempRowId(tempRowId);
      onCreateNewRow && onCreateNewRow(tempRowId);
    }

    setEditingRowId(null);
  };

  //! Renders the UI for the table.
  return (
    <Styled.TableContainer>
      <TableAction
        tableInstance={tableInstance}
        onAddItem={handleAddItem}
        onSearch={onSearch}
      />
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
            <div className="table-header-sticky">
              {headerGroups.map((headerGroup) => (
                <div {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Styled.TableHeader
                      {...column.getHeaderProps(column.getSortByToggleProps())}>
                      <ColumnHeader column={column} allColumns={columns} />
                      {isTableResizable && (
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
                      const isRowEditing =
                        row.original.id === selectedCell?.row?.original?.id ||
                        tempRowId === row.original.id;
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
                                          onClick: () => {
                                            editByCell && setSelectedCell(cell);
                                          },
                                        },
                                      ])}>
                                      {cell.render('Cell', {
                                        editable: !!isTableEditable,
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

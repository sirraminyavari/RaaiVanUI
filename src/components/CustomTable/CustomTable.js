import {
  useMemo,
  useState,
  memo,
  lazy,
  Suspense,
  // useRef,
  // useLayoutEffect,
} from 'react';
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
import CellEdit from './CellEdit';
import { getUUID } from 'helpers/helpers';

const TableModal = lazy(() =>
  import(/* webpackChunkName: "table-modal"*/ 'components/Modal/Modal')
);

const defaultPropGetter = () => ({});
const DEFAULT_MODAL_PROPS = { show: false, title: '', type: '', content: null };

/**
 * @typedef PropType
 * @type {Object}
 * @property {String} tableId - The id of the table.
 * @property {Boolean} editable - If true table cells are editable.
 * @property {Boolean} editByCell - If true every single cell can be edited.
 * @property {Boolean} resizable - If true table columns are resizable.
 * @property {Boolean} isLoading - A flag that indicates if table data is loading or not.
 * @property {Object} columns - The core columns configuration object for the entire table.
 * @property {Array} data - The data array that you want to display on the table.
 */

/**
 *  @description Renders a custom table component.
 * @component
 * @param {PropType} props -Props that passed to custom table.
 */
const CustomTable = (props) => {
  //! Properties that passed to custom table component.
  const {
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
    pagination,
    reorderRow,
    onSearch,
    tableId,
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
      editingRowId,
      onEditRowStart,
      onEditRowCancel,
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

  const handleAddItem = () => {
    // setShowFooter(true);
    if (!tempRowId) {
      let tempRowId = getUUID();
      setTempRowId(tempRowId);
      onCreateNewRow && onCreateNewRow(tempRowId);
    }

    setEditingRowId(null);
  };

  //! Render the UI for your table
  return (
    <Styled.TableContainer>
      <TableAction onAddItem={handleAddItem} onSearch={onSearch} />
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
                      const isRowEditing = row.original.id === editingRowId;
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
                                          // onClick: () => setSelectedCell(cell),
                                        },
                                      ])}>
                                      <>
                                        {cell.render('Cell', {
                                          editable: !!isTableEditable,
                                          dragHandleProps: {
                                            ...provided.dragHandleProps,
                                          },
                                        })}
                                        {!!isTableEditable && //! Table is editable in general.
                                          !!editByCell && //! Single cell edit is enabled.
                                          tempRowId !==
                                            cell?.row?.original?.id && ( //! New row id is equal to current cell id.
                                            <CellEdit
                                              cell={cell}
                                              selectedCell={selectedCell}
                                              setSelectedCell={setSelectedCell}
                                              onEditStart={() =>
                                                onEditRowStart(data)
                                              }
                                              onEditCancel={onEditRowCancel}
                                              onEdit={editRow}
                                            />
                                          )}
                                      </>
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

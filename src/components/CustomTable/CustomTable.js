import { useMemo, useState, memo } from 'react';
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
import Arrow from 'components/Icons/ArrowIcons/Arrow';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import Pagination from './Pagination';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import Modal from 'components/Modal/Modal';
import { CV_DISTANT, CV_GRAY_DARK, CV_RED } from 'constant/CssVariables';
import TableAction from './TableAction';

const defaultPropGetter = () => ({});
const DEFAULT_MODAL_PROPS = { show: false, title: '', type: '' };

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
    removeAll,
    addRow,
    pagination,
    reorderData,
    onSearch,
    tableId,
    getCellProps = defaultPropGetter,
  } = props;

  const requiredColumns = columns.filter((col) => !!col.isRequired);

  const [selectedCell, setSelectedCell] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [modal, setModal] = useState(DEFAULT_MODAL_PROPS);
  const [showFooter, setShowFooter] = useState(false);

  const restoreModalState = () => {
    setModal(DEFAULT_MODAL_PROPS);
  };

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
      removeAll,
      addRow,
      selectedCell,
      setSelectedCell,
      modal,
      setModal,
      editingRow,
      setEditingRow,
      setShowFooter,
      reorderData,
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
      <TableAction onAddRow={handleAddRow} onSearch={onSearch} />
      <Modal
        contentWidth="75%"
        show={modal.show}
        title={modal.title}
        onClose={handleOnModalClose}>
        {getModalContent()}
      </Modal>
      <Styled.TableWrapper>
        {!isLoading && (
          <Styled.Table {...getTableProps()}>
            <div>
              {headerGroups.map((headerGroup) => (
                <div {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Styled.TableHeader
                      {...column.getHeaderProps(column.getSortByToggleProps())}>
                      <Styled.HeaderWrapper canSort={column.canSort}>
                        <div>
                          {column.render('Header')}
                          {requiredColumns
                            .map((col) => col?.Header)
                            .includes(column?.Header) && (
                            <Styled.HeaderAsterisk>*</Styled.HeaderAsterisk>
                          )}
                        </div>
                        <>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <Arrow
                                dir="down"
                                circle
                                color={CV_GRAY_DARK}
                                size={24}
                                className="table-sort-arrow"
                              />
                            ) : (
                              <Arrow
                                dir="up"
                                circle
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
                                size={20}
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
              <Droppable droppableId={tableId}>
                {(provided, _) => (
                  <Styled.TableBody
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

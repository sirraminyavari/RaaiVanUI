import { useCallback, useMemo, useState, useEffect, useRef, memo } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { CV_RED } from 'constant/CssVariables';
import CustomTable from 'components/CustomTable/CustomTable';
import ColumnsFactory from 'components/CustomTable/ColumnsFactory';
import {
  cellTypes,
  normalizeCell,
  prepareHeaders,
  prepareRows,
} from 'components/CustomTable/tableUtils';
import useWindow from 'hooks/useWindowContext';
import { decodeBase64 } from 'helpers/helpers';
import {
  createFormInstance,
  removeFormInstance,
  getOwnerFormInstances,
  recoverFormInstance,
} from 'apiHelper/apiFunctions';
import UndoToast from 'components/toasts/undo-toast/UndoToast';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { getTableOptions } from './FormFieldUtils';
import saveForm from '../saveForm';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Array} tableColumns - A list of columns for table.
 * @property {Array} tableData - A list of rows for table.
 * @property {String} tableId - The id of the table.
 * @property {String} tableOwnerId - The id of the owner of the table.
 * @property {Boolean} isEditable - Whether table is editable or not?
 * @property {Boolean} isResizable - Whether table is resizable or not?
 * @property {Boolean} editByCell - Whether single cell is editable or not?
 * @property {Boolean} isNestedTable - Whether table is nested inside another table or not?
 * @property {Function} onTableContentChange - A callback function that fires whenever table content changes.
 */

/**
 *  @description Renders an table component.
 * @component
 * @param {PropType} props -Props that pass to Table.
 */
const Table = (props) => {
  const {
    tableColumns,
    tableData,
    tableId,
    tableOwnerId,
    isEditable,
    isResizable,
    editByCell,
    isNestedTable,
    onTableContentChange,
  } = props;

  const { GlobalUtilities } = useWindow();

  const [rows, setRows] = useState([]);
  const [tableContent, setTableContent] = useState([]);
  const newRowRef = useRef({});
  const beforeEditRowsRef = useRef(null);

  useEffect(() => {
    if (!!tableData) {
      const rows = prepareRows(tableData, tableColumns);
      setRows(rows);
      setTableContent(tableData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

  //! Table columns.
  const memoizedColumns = useMemo(
    () => ColumnsFactory(prepareHeaders(tableColumns, getTableOptions), rows),
    [rows, tableColumns]
  );

  //! Table row data.
  const memoizedData = useMemo(() => rows, [rows]);

  //! Get form data.
  const getFormData = () => {
    getOwnerFormInstances(tableId, tableOwnerId)
      .then((response) => {
        console.log(response, 'new table');
        const rows = prepareRows(response?.TableContent, tableColumns);
        setRows(rows);
        setTableContent(response?.TableContent);
      })
      .catch((error) => console.log(error));
  };

  const updateRowCell = (rowId, columnId, cell) => {
    setRows((oldRows) =>
      oldRows.map((row) => {
        if (row?.id === rowId) {
          return {
            ...row,
            [columnId]: cell,
          };
        }
        return row;
      })
    );
  };

  //! Fires on every cell update.
  const updateCellData = (rowId, columnId, newCellData, oldCellValue) => {
    // console.log({ newCellData }, { oldCellValue }, 'step one');
    const isNewRow = rowId.split('_')[0] === 'new';

    if (isNewRow) {
      saveRow([newCellData]);
    } else {
      saveForm([newCellData])
        .then(() => {
          updateRowCell(rowId, columnId, newCellData);
        })
        .catch((error) => {
          // console.log(error, 'save row error')
          // updateRowCell(rowId, columnId, oldCellValue);
        });
      updateRowCell(rowId, columnId, newCellData);
    }
  };
  const memoizedUpdateCellData = useCallback(updateCellData, []);

  const reorderRow = (startIndex, endIndex) => {
    const newRows = [...rows];
    const [movedRow] = newRows.splice(startIndex, 1);
    newRows.splice(endIndex, 0, movedRow);
    setRows(newRows);
  };
  const memoizedReorderRow = useCallback(reorderRow, [rows]);

  //! Close undo toast when user clicks on "X" button.
  const closeUndoToast = (toastId) => {
    toast.dismiss(toastId);
  };

  //! Undo row deletion.
  const undoRowDelete = (rowId) => {
    recoverFormInstance(rowId)
      .then((response) => {
        console.log(response);
        if (response?.Succeed) {
          getFormData();
        }
      })
      .catch((error) => console.log(error));
  };

  //! Delete table row.
  const removeRow = (row) => {
    const rowIndex = row?.index;
    const rowId = row?.original?.id;

    removeFormInstance(rowId)
      .then((response) => {
        if (response?.Succeed) {
          const message = 'ردیف حذف شد';
          const toastId = `delete-${rowId}`;
          UndoToast({
            toastId,
            message,
            autoClose: 10000,
            onUndo: () => undoRowDelete(rowId),
            closeButton: (
              <CloseIcon
                onClick={() => closeUndoToast(toastId)}
                color={CV_RED}
              />
            ),
          });

          setRows((old) => old.filter((row, index) => index !== rowIndex));
        }
      })
      .catch((error) => console.log(error));
  };
  const memoizedRemoveRow = useCallback(removeRow, []);

  //! Edit table row.
  const editRow = (rowId, columnId = null) => {
    //! Do this in nested tables.
    if (!!isNestedTable) {
      let newContentElements = rows
        ?.map((row) => Object.values(row))
        .reduce((acc, current) => {
          let id = current.shift();
          return { ...acc, [id]: current };
        }, {});

      let newTableContent = tableContent.map((content) => {
        return {
          ...content,
          Elements: newContentElements[content?.InstanceID],
        };
      });

      onTableContentChange && onTableContentChange(newTableContent);
      return;
    }

    //! Do this in main table.
    const rowElements = rows?.find((row) => row?.id === rowId);
    let elementsToSave = Object.values(rowElements).filter(
      (element) => !!element?.ElementID
    );

    //! Check if edit by cell is true.
    if (columnId) {
      elementsToSave = elementsToSave.filter(
        (element) => element?.RefElementID === columnId
      );
    }

    // console.log(elementsToSave, 'edited row');
    // console.log(columnId, 'column id');

    saveForm(elementsToSave)
      .then((response) => {
        const newRowElements = response;
        const newTableContent = tableContent.map((content) => {
          if (content?.InstanceID === rowId) {
            return Object.assign({}, content, { Elements: newRowElements });
          }
          return content;
        });

        const rows = prepareRows(newTableContent, tableColumns);
        setRows(rows);
        setTableContent(newTableContent);
      })
      .catch((error) => {
        // console.log(error, 'save row error')
      });
  };
  const memoizedEditRow = useCallback(editRow, [
    rows,
    tableContent,
    tableColumns,
    isNestedTable,
    onTableContentChange,
  ]);

  //! Fires when row edition starts.
  const onEditStart = (beforeEditRows) => {
    beforeEditRowsRef.current = beforeEditRows;
  };
  const memoizedOnEditRowStart = useCallback(onEditStart, []);

  //! Fires on row edit abortion.
  const onEditCancel = (tempRowId = '') => {
    if (!!tempRowId) {
      setRows(beforeEditRowsRef.current);
      beforeEditRowsRef.current = null;
    } else {
      setRows(beforeEditRowsRef.current);
      beforeEditRowsRef.current = null;
      newRowRef.current = {};
    }
  };

  const memoizedOnEditRowCancel = useCallback(onEditCancel, []);

  //! Save row.
  const saveRow = (newRowElements) => {
    createFormInstance(tableId, tableOwnerId)
      .then((response) => {
        if (response?.Succeed) {
          const instanceId = response?.Instance?.InstanceID;
          const extendedElements = newRowElements.map((element) => {
            return { ...element, InstanceID: instanceId };
          });

          saveForm(extendedElements)
            .then((response) => {
              getFormData();
              newRowRef.current = {};
            })
            .catch((error) => console.log(error, 'save row error'));
        }
      })
      .catch((error) => console.log(error));
  };

  const addRow = () => {
    let elements = Object.values(newRowRef.current);
    saveRow(elements);
  };
  const memoizedAddRow = useCallback(addRow, []);

  const handleOnSearch = useCallback((text) => {
    if (!!text && text.length >= 3) {
      const searchResultRows = tableData?.filter((row) => {
        let rowCellsText = '';
        for (let cell of row?.Elements) {
          if (!!cell?.DateValue_Jalali && cell?.Type === 'Date') {
            rowCellsText += ` ${cell?.DateValue_Jalali}`;
          }

          if (!!cell?.TextValue && cell?.Type === 'Text') {
            rowCellsText += ` ${decodeBase64(cell?.TextValue)}`;
          }

          if (
            !!cell?.SelectedItems.length &&
            (cell?.Type === 'User' || cell?.Type === 'Node')
          ) {
            for (let item of cell?.SelectedItems) {
              rowCellsText += ` ${decodeBase64(item?.Name)}`;
            }
          }
        }
        // console.log(tableData, rowCellsText, 'data');
        return GlobalUtilities.is_search_match(rowCellsText, text);
      });

      const rows = prepareRows(searchResultRows, tableColumns);
      setRows(rows);
    } else {
      if (tableData) {
        const rows = prepareRows(tableData, tableColumns);
        setRows(rows);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createNewRow = (tempRowId) => {
    let newRow = tableColumns
      ?.filter((col) => col?.Type !== cellTypes.separator)
      .map((column) => {
        let extendedColumn = Object.assign({}, column, {
          FormID: column.FormID,
          InstanceID: tempRowId,
          RefElementID: column.ElementID,
          GuidItems: [],
          SelectedItems: [],
          TextValue: '',
        });

        return normalizeCell(extendedColumn);
      })
      .reduce(
        (acc, column) => {
          return {
            ...acc,
            [`${column.Type}_${column.ElementID}`]: column,
          };
        },
        { id: tempRowId }
      );

    newRow.current = newRow;
    beforeEditRowsRef.current = rows;
    setRows((oldRows) => [newRow, ...oldRows]);
  };

  return (
    <CustomTable
      editable={isEditable}
      resizable={isResizable}
      editByCell={editByCell}
      pagination={{
        perPageCount: [5, 10, 20, 30],
        initialPageIndex: 0,
      }}
      columns={memoizedColumns}
      data={memoizedData}
      onCellChange={memoizedUpdateCellData}
      reorderRow={memoizedReorderRow}
      removeRow={memoizedRemoveRow}
      editRow={memoizedEditRow}
      onEditRowStart={memoizedOnEditRowStart}
      onEditRowCancel={memoizedOnEditRowCancel}
      addRow={memoizedAddRow}
      isLoading={false}
      onSearch={handleOnSearch}
      getColumnsOption={getTableOptions}
      tableId={tableId}
      getCellProps={(cell) => ({})}
      tableMirror={Table}
      onCreateNewRow={createNewRow}
    />
  );
};

Table.propTypes = {
  tableColumns: PropTypes.array,
  tableData: PropTypes.array,
  tableId: PropTypes.string,
  tableOwnerId: PropTypes.string,
  isEditable: PropTypes.bool,
  isResizable: PropTypes.bool,
  editByCell: PropTypes.bool,
  isNestedTable: PropTypes.bool,
  onTableContentChange: PropTypes.func,
};

Table.defaultProps = {
  isEditable: true,
  isResizable: true,
  editByCell: false,
};

export default memo(Table);

import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { CV_RED } from 'constant/CssVariables';
import CustomTable from 'components/CustomTable/CustomTable';
import ColumnsFactory from 'components/CustomTable/ColumnsFactory';
import { prepareHeaders, prepareRows } from 'components/CustomTable/tableUtils';
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
 * @property {Boolean} isEditable - Whether table is editable or not?.
 * @property {Boolean} isResizable - Whether table is resizable or not?.
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

  //! Fires on every cell update.
  const updateCellData = (rowId, columnId, cellData, cellValue) => {
    console.log(cellData, 'update');
    if (!!rowId) {
      setRows((old) =>
        old.map((row) => {
          if (row?.id === rowId) {
            return {
              ...row,
              [columnId]: cellData,
            };
          }
          return row;
        })
      );
    } else {
      //! New row.
      let newRowObject = { ...newRowRef.current, [columnId]: cellData };
      newRowRef.current = newRowObject;
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
  const editRow = (rowId) => {
    const rowElements = rows?.find((row) => row?.id === rowId);
    const filteredElements = Object.values(rowElements).filter(
      (element) => !!element?.ElementID
    );

    // saveRowElements(filteredElements)
    saveForm(filteredElements)
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
      .catch((error) => console.log(error, 'save row error'));
  };
  const memoizedEditRow = useCallback(editRow, [
    rows,
    tableContent,
    tableColumns,
  ]);

  //! Fires when row edition starts.
  const onEditStart = (beforeEditRows) => {
    beforeEditRowsRef.current = beforeEditRows;
  };
  const memoizedOnEditRowStart = useCallback(onEditStart, []);

  //! Fires on row edit abortion.
  const onEditCancel = () => {
    setRows(beforeEditRowsRef.current);
    beforeEditRowsRef.current = null;
    newRowRef.current = {};
  };
  const memoizedOnEditRowCancel = useCallback(onEditCancel, []);

  //! Add new row to the table.
  const addRow = () => {
    console.log(newRowRef.current, 'add before');
    createFormInstance(tableId, tableOwnerId)
      .then((response) => {
        if (response?.Succeed) {
          const instanceId = response?.Instance?.InstanceID;
          const extendedElements = Object.values(newRowRef.current).map(
            (element) => {
              return { ...element, InstanceID: instanceId };
            }
          );

          console.log(response, newRowRef.current, 'add after');

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
  }, []);

  return (
    <CustomTable
      editable={isEditable}
      resizable={isResizable}
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
    />
  );
};

Table.propTypes = {
  tableColumns: PropTypes.array,
  tableData: PropTypes.array,
  tableId: PropTypes.string,
  isEditable: PropTypes.bool,
  isResizable: PropTypes.bool,
};

Table.defaultProps = {
  isEditable: true,
  isResizable: true,
};

export default Table;

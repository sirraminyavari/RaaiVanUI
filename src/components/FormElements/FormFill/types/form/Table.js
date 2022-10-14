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
import { decodeBase64, getWeekDay, random } from 'helpers/helpers';
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
import { saveFormInstanceElements } from 'apiHelper/ApiHandlers/FGAPI/FGAPI';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Array} tableColumns - A list of columns for table.
 * @property {Array} tableData - A list of rows for table.
 * @property {String} FormID - The id of the table.
 * @property {String} ElementID - The id of the owner of the table.
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
    FormID,
    ElementID,
    isEditable,
    isResizable,
    editByCell,
    isNestedTable,
    onTableContentChange,
    title,
    RefElementID,
    SequenceNumber,
    InstanceID,
  } = props;

  const { GlobalUtilities } = useWindow();

  const [rows, setRows] = useState([]);
  const [tableContent, setTableContent] = useState([]);
  const [tableFormID, setTableFormID] = useState(FormID);
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

  //! Get table data.
  const getFormData = useCallback(() => {
    return getOwnerFormInstances(tableFormID, ElementID)
      .then((response) => {
        const rows = prepareRows(response?.TableContent, tableColumns);
        setRows(rows);
        setTableContent(response?.TableContent);
      })
      .catch((error) => console.log(error));
  }, [tableFormID, ElementID]);

  //! Update table content(client side).
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
      //! If new row is being edited.
      saveRow([newCellData]);
    } else {
      //! Row already exists.
      if (editByCell) {
        //! Edit by cell mode is activated.
        saveForm([newCellData])
          .then(() => {
            updateRowCell(rowId, columnId, newCellData);
          })
          .catch((error) => {
            // console.log(error, 'save row error')
            // updateRowCell(rowId, columnId, oldCellValue);
          });
      }

      //! If edit by cell mode is not activated.
      //! Then user should be able to edit the whole row.
      //! So user need to save the whole row manually.
      updateRowCell(rowId, columnId, newCellData);
    }
  };
  const memoizedUpdateCellData = useCallback(updateCellData, []);

  const hasInitiated = useMemo(() => {
    return !!(ElementID && RefElementID && ElementID !== RefElementID);
  }, [ElementID, RefElementID]);

  //! Reorder table rows by drag and drop(client side now & need to save order).
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

  //! Undo row deletion. restore deleted row.
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
    console.log({ row, rows });
    if (typeof row === 'string' && row.startsWith('new_')) {
      setRows((old) => old.filter((row) => row?.id !== row));
      getFormData();
    } else {
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
    }
  };
  const memoizedRemoveRow = useCallback(removeRow, []);

  //! Edit table row.
  const editRow = (rowId, columnId = null) => {
    //! Do this in nested tables.
    //! If we are in nested table, we do not want to save it, just callback.
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
      getFormData();
    }

    //! Do this in main table.
    //! in main table we want to save the row.
    const rowElements = rows?.find((row) => row?.id === rowId);

    //! Editing whole row.
    let elementsToSave = Object.values(rowElements).filter(
      (element) => !!element?.ElementID
    );

    //! Check if edit by cell is true. Editing single cell.
    if (!!editByCell) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedEditRow = useCallback(editRow, [
    rows,
    tableContent,
    tableColumns,
    isNestedTable,
    onTableContentChange,
    editByCell,
  ]);

  //! Fires when row edition starts.
  const onEditStart = (beforeEditRows) => {
    //! Exclude temporary new row(if exists).
    let newRows = beforeEditRows.filter(
      (row) => row?.id.split('_')[0] !== 'new'
    );
    beforeEditRowsRef.current = newRows;
    setRows(newRows);
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
  const saveRow = useCallback(
    async (newRowElements) => {
      //! Create new row instance.
      let newElementID;
      if (!hasInitiated) {
        const { FilledElements } = await saveFormInstanceElements({
          Elements: [
            {
              ElementID,
              InstanceID,
              Title: title,
              SequenceNumber,
              Filled: false,
              Type: 'Form',
            },
          ],
        });
        newElementID = FilledElements?.NewElementID;
        setTableFormID(newElementID);

        await getFormData(); //! Refresh table data.
      }
      createFormInstance(newElementID || tableFormID, ElementID)
        .then((response) => {
          if (response?.Succeed) {
            const instanceId = response?.Instance?.InstanceID;
            const extendedElements = newRowElements.map((element) => {
              return { ...element, InstanceID: instanceId };
            });

            //! Save elements to the row instance that just has been created.
            saveForm(extendedElements)
              .then((response) => {
                getFormData(); //! Refresh table data.
                newRowRef.current = {};
              })
              .catch((error) => console.log(error, 'save row error'));
          }
        })
        .catch((error) => console.log(error));
    },
    [
      hasInitiated,
      tableFormID,
      ElementID,
      InstanceID,
      title,
      SequenceNumber,
      getFormData,
    ]
  );

  //! Add new row.
  const addRow = async () => {
    alert('adding row');
    let elements = Object.values(newRowRef.current);
    // saveRow(elements);
  };
  const memoizedAddRow = useCallback(addRow, [saveRow]);

  //! Duplicate a given row.
  const duplicateRow = (row) => {
    let elements = Object.values(row?.original)
      .filter((element) => typeof element === 'object')
      .filter((element) => !['File', 'Form'].includes(element?.Type)) //! Exclude files and forms.
      .map((element) => {
        return {
          ...element,
          Filled: false,
          RefElementID: '',
          ElementID: !!element?.RefElementID
            ? element?.RefElementID
            : element.ElementID,
        };
      });

    saveRow(elements);
  };
  const memoizedDuplicateRow = useCallback(duplicateRow, []);

  //! Search in table.
  const handleOnSearch = useCallback((text) => {
    //! If there are some text for search.
    if (!!text && text.length >= 3) {
      const searchResultRows = tableData?.filter((row) => {
        let rowCellsText = '';
        for (let cell of row?.Elements) {
          //! Search in "date" cells.
          if (!!cell?.DateValue_Jalali && cell?.Type === 'Date') {
            rowCellsText += ` ${getWeekDay(cell?.DateValue)}`;
          }

          //! Search in "text" and "checkbox" cells.
          if (!!cell?.TextValue && ['Text', 'Checkbox'].includes(cell?.Type)) {
            rowCellsText += ` ${decodeBase64(cell?.TextValue)}`;
          }

          //! Search in "user", "node" and "multilevel" cells.
          if (
            !!cell?.SelectedItems.length &&
            ['User', 'Node', 'MultiLevel'].includes(cell?.Type)
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
      //! If there is no text for search.
      if (tableData) {
        const rows = prepareRows(tableData, tableColumns);
        setRows(rows);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //! Create new row and add it to the beginning of the row list.
  const createNewRow = useCallback(
    async (tempRowId) => {
      let newRow = tableColumns
        ?.filter((col) => col?.Type !== cellTypes.separator) //! Exclude separator type.
        .map((column) => {
          let extendedColumn = Object.assign({}, column, {
            FormID: '',
            InstanceID: tempRowId, //! add temporary id until row is saved(and gets real id).
            RefElementID: '',
            GuidItems: [],
            SelectedItems: [],
            TextValue: '',
          });

          return normalizeCell(extendedColumn);
        })
        .reduce(
          //! Reduce to one object(suitable for table format).
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
    },
    [tableData]
  );

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
      FormID={tableFormID}
      getCellProps={(cell) => ({})}
      tableMirror={Table}
      onCreateNewRow={createNewRow}
      onDuplicateRow={memoizedDuplicateRow}
    />
  );
};

Table.propTypes = {
  tableColumns: PropTypes.array,
  tableData: PropTypes.array,
  FormID: PropTypes.string,
  ElementID: PropTypes.string,
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

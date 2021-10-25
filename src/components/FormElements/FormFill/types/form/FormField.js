import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import FormCell from 'components/FormElements/FormFill/FormCell';
import TableIcon from 'components/Icons/TableIcon/TableIcon';
import { CV_GRAY, CV_RED } from 'constant/CssVariables';
import CustomTable from 'components/CustomTable/CustomTable';
import ColumnsFactory from 'components/CustomTable/ColumnsFactory';
import {
  cellTypes,
  prepareHeaders,
  prepareRows,
} from 'components/CustomTable/tableUtils';
import useWindow from 'hooks/useWindowContext';
import { decodeBase64, toJSON } from 'helpers/helpers';
import {
  createFormInstance,
  removeFormInstance,
  getOwnerFormInstances,
  recoverFormInstance,
} from 'apiHelper/apiFunctions';
import UndoToast from 'components/toasts/undo-toast/UndoToast';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
// import { saveRowElements } from './FormFieldUtils';
import saveForm from '../saveForm';

const FormField = (props) => {
  const {
    tableColumns,
    tableData,
    decodeInfo,
    decodeTitle,
    elementId,
    type,
    ...rest
  } = props;

  // console.log(tableColumns, 'col');

  const { GlobalUtilities } = useWindow();
  const { FormID } = toJSON(decodeInfo);

  const [rows, setRows] = useState([]);
  const [tableContent, setTableContent] = useState([]);
  const beforeEditRowsRef = useRef(null);
  const newRowRef = useRef({});
  // const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!!tableData) {
      const rows = prepareRows(tableData, tableColumns);
      setRows(rows);
      setTableContent(tableData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

  const getFormData = () => {
    getOwnerFormInstances(FormID, elementId)
      .then((response) => {
        console.log(response, 'new table');
        const rows = prepareRows(response?.TableContent, tableColumns);
        setRows(rows);
        setTableContent(response?.TableContent);
      })
      .catch((error) => console.log(error));
  };

  const getOptions = (column) => {
    switch (column?.Type) {
      case cellTypes.action:
        return {
          editable: false,
          width: 35,
          disableSortBy: true,
        };

      case cellTypes.index:
        return {
          editable: false,
          width: 40,
          disableSortBy: true,
        };

      case cellTypes.text:
        return { maxWidth: 200 };

      case cellTypes.singleSelect:
        return { disableSortBy: true, minWidth: 135 };

      case cellTypes.multiSelect:
        return { disableSortBy: true, minWidth: 135 };

      case cellTypes.date:
        return { minWidth: 200 };

      case cellTypes.number:
        return { minWidth: 150 };

      case cellTypes.binary:
        return { disableSortBy: true };

      case cellTypes.user:
        return { disableSortBy: true, minWidth: 260 };

      case cellTypes.node:
        return { disableSortBy: true, minWidth: 260 };

      case cellTypes.file:
        return { disableSortBy: true, minWidth: 200 };

      // case cellTypes.recordInfo:
      //   return {
      //     disableSortBy: true,
      //     minWidth: 190,
      //   };

      default:
        return {
          editable: true,
          minWidth: 200,
        };
    }
  };

  const memoizedData = useMemo(() => rows, [rows]);
  const memoizedColumns = useMemo(
    () => ColumnsFactory(prepareHeaders(tableColumns, getOptions), rows),
    [rows, tableColumns]
  );

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

  const onEditStart = (beforeEditRows) => {
    beforeEditRowsRef.current = beforeEditRows;
  };

  const memoizedOnEditRowStart = useCallback(onEditStart, []);

  const onEditCancel = () => {
    setRows(beforeEditRowsRef.current);
    beforeEditRowsRef.current = null;
    newRowRef.current = {};
  };

  const memoizedOnEditRowCancel = useCallback(onEditCancel, []);

  const memoizedUpdateCellData = useCallback(updateCellData, []);

  //! Close undo toast when user clicks on "X" button.
  const closeUndoToast = (toastId) => {
    toast.dismiss(toastId);
  };

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

  const reorderRow = (startIndex, endIndex) => {
    const newRows = [...rows];
    const [movedRow] = newRows.splice(startIndex, 1);
    newRows.splice(endIndex, 0, movedRow);
    setRows(newRows);
  };

  const memoizedReorderRow = useCallback(reorderRow, [rows]);

  const addRow = () => {
    console.log(newRowRef.current, 'add before');
    createFormInstance(FormID, elementId)
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
    <FormCell
      iconComponent={<TableIcon size={15} color={CV_GRAY} />}
      title={decodeTitle}
      {...rest}>
      <div style={{ width: '50rem' }}>
        <CustomTable
          editable
          resizable
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
          getColumnsOption={getOptions}
          tableId={tableColumns[0]?.FormID}
          getCellProps={(cell) => ({})}
        />
      </div>
    </FormCell>
  );
};

export default FormField;

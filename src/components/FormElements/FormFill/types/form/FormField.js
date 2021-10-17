import { useCallback, useMemo, useState, useEffect } from 'react';
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

  const { GlobalUtilities } = useWindow();
  const { FormID } = toJSON(decodeInfo);

  const [data, setData] = useState([]);
  // const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!!tableData) {
      const rows = prepareRows(tableData, tableColumns);
      setData(rows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

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
        return { disableSortBy: true, minWidth: 200 };

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

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(
    () => ColumnsFactory(prepareHeaders(tableColumns, getOptions), data),
    [data, tableColumns]
  );

  const updateCellData = (rowId, columnId, cellData, value) => {
    console.log({ cellData, value, rowId, columnId }, 'update');

    if (rowId) {
      setData((old) =>
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
    }
  };

  const saveRow = (rowId) => {
    const rowElements = data?.find((row) => row?.id === rowId);
    const filteredElements = Object.values(rowElements).filter(
      (element) => !!element?.ElementID
    );

    // saveRowElements(filteredElements)
    saveForm(filteredElements)
      .then((response) => console.log(response, 'save row response'))
      .catch((error) => console.log(error, 'save row error'));
  };

  const memoizedSaveRow = useCallback(saveRow, [data]);

  const memoizedUpdateCellData = useCallback(updateCellData, []);

  //! Close undo toast when user clicks on "X" button.
  const closeUndoToast = (toastId) => {
    toast.dismiss(toastId);
  };

  const undoRowDelete = (rowId) => {};

  const removeRow = (row) => {
    const rowIndex = row?.index;
    const rowId = row?.original?.id;

    removeFormInstance(rowId)
      .then((response) => {
        if (response?.Succeed) {
          setData((old) => old.filter((row, index) => index !== rowIndex));

          const deleteMSG = 'ردیف حذف شد';
          UndoToast({
            autoClose: 7000,
            message: deleteMSG,
            onUndo: () => undoRowDelete(rowId),
            toastId: `delete-${rowId}`,
            closeButton: (
              <CloseIcon
                onClick={() => closeUndoToast(`delete-${rowId}`)}
                color={CV_RED}
              />
            ),
          });
        }
      })
      .catch((error) => console.log(error));
  };

  const memoizedRemoveRow = useCallback(removeRow, []);

  const reorderData = (startIndex, endIndex) => {
    const newData = [...data];
    const [movedRow] = newData.splice(startIndex, 1);
    newData.splice(endIndex, 0, movedRow);
    setData(newData);
  };

  const memoizedReorderData = useCallback(reorderData, [data]);

  const addRow = () => {
    createFormInstance(FormID, elementId)
      .then((response) => {
        if (response?.Succeed) {
          console.log(response, 'add row');
          getOwnerFormInstances(FormID, elementId)
            .then((response) => {
              console.log(response, 'new table');
              const rows = prepareRows(response?.TableContent, tableColumns);
              setData(rows);
            })
            .catch((error) => console.log(error));
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
      setData(rows);
    } else {
      if (tableData) {
        const rows = prepareRows(tableData, tableColumns);
        setData(rows);
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
          reorderData={memoizedReorderData}
          removeRow={memoizedRemoveRow}
          saveRow={memoizedSaveRow}
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

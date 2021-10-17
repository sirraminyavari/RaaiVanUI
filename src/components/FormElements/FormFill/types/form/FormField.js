import { useCallback, useMemo, useState, useEffect } from 'react';
import FormCell from 'components/FormElements/FormFill/FormCell';
import TableIcon from 'components/Icons/TableIcon/TableIcon';
import { CV_GRAY } from 'constant/CssVariables';
import CustomTable from 'components/CustomTable/CustomTable';
import ColumnsFactory from 'components/CustomTable/ColumnsFactory';
import {
  cellTypes,
  prepareHeaders,
  prepareRows,
} from 'components/CustomTable/tableUtils';
import useWindow from 'hooks/useWindowContext';
import { decodeBase64 } from 'helpers/helpers';
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

  // console.log({ tableColumns, tableData });

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

  const memoizedUpdateCellData = useCallback(updateCellData, []);

  const removeRow = (rowIndex) => {
    setData((old) => old.filter((row, index) => index !== rowIndex));
  };

  const memoizedRemoveRow = useCallback(removeRow, []);

  const saveRow = (rowId) => {
    const rowElements = data?.find((row) => row?.id === rowId);
    const elementsToSave = Object.values(rowElements).filter(
      (element) => !!element?.ElementID
    );

    saveForm(elementsToSave)
      .then((response) => console.log(response, 'save row response'))
      .catch((error) => console.log(error, 'save row error'));
  };

  const memoizedSaveRow = useCallback(saveRow, [data]);

  const reorderData = (startIndex, endIndex) => {
    const newData = [...data];
    const [movedRow] = newData.splice(startIndex, 1);
    newData.splice(endIndex, 0, movedRow);
    setData(newData);
  };

  const memoizedReorderData = useCallback(reorderData, [data]);

  const addRow = () => {
    console.log('add row api');
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

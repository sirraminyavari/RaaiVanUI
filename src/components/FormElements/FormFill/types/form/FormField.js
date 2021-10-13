import { useCallback, useMemo, useState, useEffect } from 'react';
import FormCell from 'components/FormElements/FormFill/FormCell';
import TableIcon from 'components/Icons/TableIcon/TableIcon';
import { CV_GRAY } from 'constant/CssVariables';
import CustomTable from 'components/CustomTable/CustomTable';
import ColumnsFactory from 'components/CustomTable/ColumnsFactory';
// import tData from './tableData';
// import headers from './headers';
import { prepareHeaders, prepareRows } from './formFieldUtils';
import useWindow from 'hooks/useWindowContext';
import { decodeBase64 } from 'helpers/helpers';

const FormField = (props) => {
  const {
    tableColumns,
    tableData,
    decodeInfo,
    decodeTitle,
    onAnyFieldChanged,
    elementId,
    type,
    save,
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

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(
    () => ColumnsFactory(prepareHeaders(tableColumns), data),
    [data, tableColumns]
  );

  const updateCellData = (rowId, columnId, cellData, value) => {
    // console.log({ cellData, value });
    const elementId = cellData?.ElementID;
    const type = cellData?.Type;
    onAnyFieldChanged(elementId, value, type);

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
  };

  const memoizedUpdateCellData = useCallback(updateCellData, []);

  const removeRow = (rowIndex) => {
    setData((old) => old.filter((row, index) => index !== rowIndex));
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
    const newRecord = {
      id: '10',
      firstName: 'نام دهم',
      lastName: 'نام خانوادگی دهم',
      country: 'ایران',
      city: 'طهران',
      age: 50,
      dateOfBirth: '2008/11/02',
      progress: 100,
    };
    const newData = [...data, newRecord];
    setData(newData);
  };

  const memoizedAddRow = useCallback(addRow, []);

  const removeAll = useCallback(() => {
    setData([]);
  }, []);

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
          editable //! This prop makes the whole table editable.
          resizable //! This prop makes the whole columns of a table resizable.
          pagination={{
            perPageCount: [5, 10, 20, 30],
            initialPageIndex: 0,
          }}
          columns={memoizedColumns}
          data={memoizedData}
          onCellChange={memoizedUpdateCellData}
          reorderData={memoizedReorderData}
          removeRow={memoizedRemoveRow}
          addRow={memoizedAddRow}
          isLoading={false}
          removeAll={removeAll}
          onSearch={handleOnSearch}
          tableId={tableColumns[0]?.FormID}
          getCellProps={(cell) => ({})}
        />
      </div>
    </FormCell>
  );
};

export default FormField;

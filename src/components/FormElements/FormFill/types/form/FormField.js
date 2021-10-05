import FormCell from 'components/FormElements/FormFill/FormCell';
import TableIcon from 'components/Icons/TableIcon/TableIcon';
import { CV_GRAY } from 'constant/CssVariables';
import CustomTable from 'components/CustomTable/CustomTable';
import ColumnsFactory from 'components/CustomTable/ColumnsFactory';
// import tData from './tableData';
// import headers from './headers';
import { useCallback, useMemo, useState, useEffect } from 'react';
import useWindow from 'hooks/useWindowContext';
import { prepareCell, prepareHeaders } from './formFieldUtils';

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

  const [data, setData] = useState([]);

  useEffect(() => {
    if (!!tableData) {
      const rows = tableData?.map((row) => {
        const cells = tableColumns?.map((col) => {
          const arr = row?.Elements?.filter(
            (e) =>
              e?.ElementID === col?.ElementID ||
              e?.RefElementID === col?.ElementID
          );
          return arr?.length ? arr[0] : GlobalUtilities.extend({}, col);
        });
        return cells.reduce((acc, cell) => ({ ...acc, ...prepareCell(cell) }), {
          id: row?.InstanceID,
        });
      });

      setData(rows);
      console.log(
        {
          rawData: { tableColumns, tableData },
          processedData: { headers: prepareHeaders(tableColumns), rows },
        },
        'form'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(
    () => ColumnsFactory(prepareHeaders(tableColumns), data),
    [data, tableColumns]
  );

  const updateCellData = (rowIndex, columnId, value) => {
    // console.log(value);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
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
          updateCellData={memoizedUpdateCellData}
          reorderData={memoizedReorderData}
          removeRow={memoizedRemoveRow}
          addRow={memoizedAddRow}
          isFetching={false}
          removeAll={removeAll}
          getCellProps={(cell) => ({})}
        />
      </div>
    </FormCell>
  );
};

export default FormField;

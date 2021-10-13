import { useState, useEffect, useMemo } from 'react';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import CustomTable from 'components/CustomTable/CustomTable';
import ColumnsFactory from 'components/CustomTable/ColumnsFactory';
import { prepareHeaders, prepareRows } from 'components/CustomTable/tableUtils';
import { getOwnerFormInstances } from 'apiHelper/apiFunctions';
import { decodeBase64, toJSON } from 'helpers/helpers';

const TableCellModal = ({ value, getColumnsOption }) => {
  const { Info } = value || {};
  const tableInfo = toJSON(decodeBase64(Info));

  const tableId = tableInfo?.FormID;
  const tableOwnerId = value?.ElementID || value?.RefElementID;

  const [rawData, setRawData] = useState([]);
  const [rawColumns, setRawColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (tableId && tableOwnerId) {
      setIsFetching(true);
      getOwnerFormInstances(tableId, tableOwnerId)
        .then((response) => {
          setIsFetching(false);

          const rawTableData = response?.TableContent || [];
          const rawTableColumns = response?.TableColumns || [];
          if (!!response.TableContent) {
            const rows = prepareRows(rawTableData, rawTableColumns);
            setData(rows);
          }

          setRawColumns(rawTableColumns);
          setRawData(rawTableData);
        })
        .catch((error) => {
          setIsFetching(false);
          console.log(error);
        });
    }
  }, [tableId, tableOwnerId]);

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = ColumnsFactory(
    prepareHeaders(rawColumns, getColumnsOption),
    data
  );

  return (
    <div>
      {isFetching && <LogoLoader />}
      {!isFetching && (
        <CustomTable
          editable //! This prop makes the whole table editable.
          resizable //! This prop makes the whole columns of a table resizable.
          pagination={{
            perPageCount: [5, 10, 20, 30],
            initialPageIndex: 0,
          }}
          columns={memoizedColumns}
          data={memoizedData}
          // onCellChange={memoizedUpdateCellData}
          // reorderData={memoizedReorderData}
          // removeRow={memoizedRemoveRow}
          // addRow={memoizedAddRow}
          isLoading={false}
          // onSearch={handleOnSearch}
          tableId={tableId}
          getCellProps={(cell) => ({})}
        />
      )}
    </div>
  );
};

export default TableCellModal;

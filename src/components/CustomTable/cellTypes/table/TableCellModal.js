import { useState, useEffect } from 'react';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { getOwnerFormInstances } from 'apiHelper/apiFunctions';

const TableCellModal = ({
  value,
  // getColumnsOption,
  row,
  column,
  header,
  editingRow,
  editable: isTableEditable,
  isNew,
  tableMirror: Table,
}) => {
  const { Info } = value || {};

  const rowId = row?.original?.id;
  const columnId = column?.id;

  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  const canEdit = isTableEditable && isCellEditable && isRowEditing;

  const tableId = Info?.FormID;
  const tableOwnerId = value?.ElementID || value?.RefElementID;

  const [rawData, setRawData] = useState([]);
  const [rawColumns, setRawColumns] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (tableId && tableOwnerId) {
      setIsFetching(true);
      getOwnerFormInstances(tableId, tableOwnerId)
        .then((response) => {
          setIsFetching(false);

          const rawTableData = response?.TableContent || [];
          const rawTableColumns = response?.TableColumns || [];

          setRawColumns(rawTableColumns);
          setRawData(rawTableData);
        })
        .catch((error) => {
          setIsFetching(false);
          console.log(error);
        });
    }
  }, []);

  return (
    <div>
      {isFetching && <LogoLoader />}
      {!isFetching && !!rawData?.length && (
        <Table
          tableColumns={rawColumns}
          tableData={rawData}
          tableId={tableId}
          tableOwnerId={tableOwnerId}
          isEditable={canEdit}
          isResizable={true}
        />
      )}
    </div>
  );
};

export default TableCellModal;

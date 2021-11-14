import { useState, useEffect, useMemo } from 'react';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { getOwnerFormInstances } from 'apiHelper/apiFunctions';

const TableCellModal = (props) => {
  const {
    value,
    // getColumnsOption,
    row,
    column,
    header,
    editingRow,
    editable: isTableEditable,
    isNew,
    tableMirror: Table,
    onCellChange,
  } = props;

  const { Info } = value || {};

  const rowId = row?.original?.id;
  const columnId = column?.id;

  const isCellEditable = !!header?.options?.editable;
  const isRowEditing = rowId === editingRow;

  const canEdit = isTableEditable && isCellEditable && isRowEditing;

  const tableId = Info?.FormID;
  const tableOwnerId = value?.RefElementID ? value?.ElementID : null;

  const [rawData, setRawData] = useState([]);
  const [rawColumns, setRawColumns] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const handleTableContentChange = (tableContent) => {
    let tableCell = {
      ...value,
      TableContent: tableContent,
    };

    onCellChange(rowId, columnId, tableCell, tableContent);
  };

  useEffect(() => {
    if (tableId && tableOwnerId) {
      setIsFetching(true);
      getOwnerFormInstances(tableId, tableOwnerId)
        .then((response) => {
          const rawTableData = response?.TableContent || [];
          const rawTableColumns = response?.TableColumns || [];

          setRawColumns(rawTableColumns);
          setRawData(rawTableData);

          setIsFetching(false);
        })
        .catch((error) => {
          setIsFetching(false);
          console.log(error);
        });
    }
  }, []);

  const memoizedRawData = useMemo(() => rawData, [rawData]);

  return (
    <div>
      {isFetching && <LogoLoader />}
      {!isFetching && (
        <Table
          tableColumns={rawColumns}
          tableData={memoizedRawData}
          tableId={tableId}
          tableOwnerId={tableOwnerId}
          onTableContentChange={handleTableContentChange}
          isEditable={canEdit}
          isResizable={true}
          isNestedTable
        />
      )}
    </div>
  );
};

export default TableCellModal;

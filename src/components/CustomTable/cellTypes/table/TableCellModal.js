import { useState, useEffect } from 'react';
import CustomTable from 'components/CustomTable/CustomTable';
import ColumnsFactory from 'components/CustomTable/ColumnsFactory';
import { getOwnerFormInstances } from 'apiHelper/apiFunctions';

const TableCellModal = (props) => {
  const { tableId, tableOwnerId } = props;

  useEffect(() => {
    if (tableId && tableOwnerId) {
      getOwnerFormInstances(tableId, tableOwnerId)
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    }
  }, [tableId, tableOwnerId]);

  return (
    <div>
      <div>{tableId}</div>
      <div>{tableOwnerId}</div>
    </div>
  );
};

export default TableCellModal;

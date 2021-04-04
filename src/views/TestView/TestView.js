import { useMemo, useState } from 'react';
import CustomTable from 'components/CustomTable/CustomTable';
import tableData from './tableData';
import tableCulomns from './tableCulomns';

const TestView = () => {
  const [data, setData] = useState(() => tableData);
  const columns = useMemo(() => tableCulomns, []);

  const updateCellData = (rowIndex, columnId, value) => {
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

  return (
    <div>
      <CustomTable
        columns={columns}
        data={data}
        updateCellData={updateCellData}
      />
    </div>
  );
};

export default TestView;

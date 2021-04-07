import { useMemo, useState } from 'react';
import CustomTable from 'components/CustomTable/CustomTable';
import tableData from './tableData';
import makeCulomns from './makeColumns';
import DeleteRowIcon from 'components/Icons/DeleteRowIcon/DeleteRowIcon';

const headers = [
  { firstName: 'نام', dataType: 'string' },
  { lastName: 'نام خانوادگی', dataType: 'string' },
  { country: 'کشور', dataType: 'string' },
  { city: 'شهر', dataType: 'string' },
  { age: 'سن', dataType: 'integer' },
  { dateOfBirth: 'تاریخ تولد', dataType: 'date' },
  { progress: 'پیشرفت پروفایل', dataType: 'integer' },
];

const TestView = () => {
  const [data, setData] = useState(() => tableData);
  const columns = useMemo(
    () =>
      makeCulomns(headers, {
        delete: (rowIndex) => (
          <DeleteRowIcon
            size={25}
            style={{ cursor: 'pointer' }}
            onClick={() => removeRow(rowIndex)}
          />
        ),
      }),
    []
  );

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

  const removeRow = (rowIndex) => {
    setData((old) => old.filter((row, index) => index !== rowIndex));
  };

  const reorderData = (startIndex, endIndex) => {
    const newData = [...data];
    const [movedRow] = newData.splice(startIndex, 1);
    newData.splice(endIndex, 0, movedRow);
    setData(newData);
  };

  return (
    <div>
      <CustomTable
        editable
        columns={columns}
        data={data}
        updateCellData={updateCellData}
        reorderData={reorderData}
        removeRow={removeRow}
        getCellProps={(cell) => ({
          onClick: () => console.log(cell),
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
        })}
        getHeaderProps={(column) => ({
          onClick: () => console.log('Header!'),
        })}
        getColumnProps={(column) => ({
          onClick: () => console.log('Column!'),
        })}
        getRowProps={(row) => ({
          onClick: console.log('Row selected!'),
        })}
      />
    </div>
  );
};

export default TestView;

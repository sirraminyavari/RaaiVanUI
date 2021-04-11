import { useMemo, useState } from 'react';
import CustomTable from 'components/CustomTable/CustomTable';
import tableData from './tableData';
import makeCulomns from 'components/CustomTable/makeColumns';
import DeleteRowIcon from 'components/Icons/DeleteRowIcon/DeleteRowIcon';
import ViewRowIcon from 'components/Icons/ViewIcon/ViewIcon';

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
        delete: () => <DeleteRowIcon size={25} style={{ cursor: 'pointer' }} />,
        view: () => <ViewRowIcon size={25} style={{ cursor: 'pointer' }} />,
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

  const removeAll = () => {
    setData([]);
  };

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

  return (
    <div>
      <CustomTable
        editable
        columns={columns}
        data={data}
        updateCellData={updateCellData}
        reorderData={reorderData}
        removeRow={removeRow}
        addRow={addRow}
        isFetching={false}
        removeAll={removeAll}
        getCellProps={(cell) => ({
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
        })}
      />
    </div>
  );
};

export default TestView;

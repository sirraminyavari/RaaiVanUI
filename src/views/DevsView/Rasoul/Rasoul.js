import { useMemo, useState } from 'react';

//! CustomTable
import CustomTable from 'components/CustomTable/CustomTable';
import tableData from './tableData';
import ColumnsFactory from 'components/CustomTable/ColumnsFactory';
import DeleteRowIcon from 'components/Icons/DeleteRowIcon/DeleteRowIcon';
import ViewRowIcon from 'components/Icons/ViewIcon/ViewIcon';

//! Dropzone
import CustomDropzone from 'components/CustomDropzone/CustomDropzone';

//! ProgressBar
import ProgressBar from 'components/ProgressBar/ProgressBar';

const headers = [
  { firstName: 'نام', dataType: 'string' },
  { lastName: 'نام خانوادگی', dataType: 'string' },
  { country: 'کشور', dataType: 'string' },
  { city: 'شهر', dataType: 'string' },
  { age: 'سن', dataType: 'integer' },
  { dateOfBirth: 'تاریخ تولد', dataType: 'date' },
  { progress: 'پیشرفت پروفایل', dataType: 'integer' },
];

const RasoulView = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState([]);

  setTimeout(() => {
    setData(tableData);
    setIsFetching(false);
  }, 2000);

  const columns = useMemo(
    () =>
      ColumnsFactory(headers, {
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
      <div style={{ textAlign: 'center', fontSize: '2rem' }}>
        Rasoul's window
      </div>
      <hr />
      <div style={{ textAlign: 'center', fontSize: '2rem' }}>
        Custom Table Component
      </div>
      <CustomTable
        editable
        columns={columns}
        data={data}
        updateCellData={updateCellData}
        reorderData={reorderData}
        removeRow={removeRow}
        addRow={addRow}
        isFetching={isFetching}
        removeAll={removeAll}
        getCellProps={(cell) => ({
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
        })}
      />
      <hr />
      <div style={{ textAlign: 'center', fontSize: '2rem' }}>
        Custom Dropzone Component
      </div>
      <CustomDropzone
        accept=".pdf"
        // exceptions={['pdf', 'jpg']}
        maxFiles={3}
        maxEachSize={1}
        maxTotalSize={1}
        onError={(error) => console.log(error)}
        nodeId="40aa835f-751c-4786-86af-fec04f45d262"
        // disabled
      />
      <hr />
      <div style={{ textAlign: 'center', fontSize: '2rem' }}>
        Custom Progressbar Component
      </div>
      <ProgressBar label="Label" progress={100} />
      <hr />
      <div style={{ textAlign: 'center', fontSize: '2rem' }}>End of view</div>
    </div>
  );
};

export default RasoulView;

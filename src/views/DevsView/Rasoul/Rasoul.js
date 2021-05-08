import { useMemo, useState, useRef } from 'react';
import Divider from './Divider';

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

//! Custom Tree
import DnDTree from 'components/Tree/CustomTree/DnDTree';
import { customTreeData } from './treeData';

//! Atlasian Tree
import AtlasianTree from 'components/Tree/AtlasianTree/AtlasianTree';

//! DnDProvider
import DnDProvider from 'components/DnDProvider/DnDProvider';
import dndData from './dndData';

//! Multi Column DnD
import MultiDnD from 'components/MultiColumnDnD/MultiColumnDnD';

//! Custom Date Picker
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';

//! Resizable
import Resizeable from 'components/Resizable/Resizable';

const headers = [
  { firstName: 'نام', dataType: 'string' },
  { lastName: 'نام خانوادگی', dataType: 'string' },
  { country: 'کشور', dataType: 'string' },
  { city: 'شهر', dataType: 'string' },
  { age: 'سن', dataType: 'integer' },
  { dateOfBirth: 'تاریخ تولد', dataType: 'date' },
  { progress: 'پیشرفت پروفایل', dataType: 'integer' },
];

const initialSize = {
  width: 200,
  height: 400,
};

const RasoulView = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState([]);
  const [size, setSize] = useState(initialSize);
  const [showSize, setShowSize] = useState(initialSize);

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

  const handleOnResizeEnd = (size) => {
    setSize(size);
    console.log(size, 'resize ended');
  };

  const handleOnResizeStart = (size) => {
    console.log(size, 'resize started');
  };

  const handleOnResizing = (size) => {
    setShowSize(size);
    console.log(size, 'resizing');
  };

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
      <div style={{ textAlign: 'center', fontSize: '2rem' }}>Rasoul's view</div>
      <Divider title="Custom Table Component" />
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
      <Divider title="Custom Dropzone Component" />
      <CustomDropzone
        accept={['image/*', '.pdf']}
        exceptions={['jpg']}
        maxFiles={3}
        maxEachSize={1}
        maxTotalSize={1}
        onError={(error) => console.log(error)}
        ownerId="40aa835f-751c-4786-86af-fec04f45d262"
        ownerType="Node"
        // disabled
      />
      <Divider title="Custom Progressbar Component" />
      <ProgressBar label="Label" progress={100} />
      <Divider title="Custom Tree Component(broken dnd)" />
      <DnDTree data={customTreeData} />
      <Divider title="Atlasian Tree Component(with dnd)" />
      <AtlasianTree />
      <Divider title="Multi column dnd" />
      <MultiDnD />
      <Divider title="Custom Date Picker" />
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <CustomDatePicker
            label=" انتخاب تاریخ جلالی"
            mode="button"
            type="jalali"
            clearButton
            fromToday
            onDateSelect={(date) => console.log(date)}
          />
        </div>
        <div>
          <CustomDatePicker
            label="english date"
            mode="input"
            type="‫‪gregorian‬‬"
            clearButton
            onDateSelect={(date) => console.log(date)}
          />
        </div>
      </div>

      {/* <Divider title="DnDProvider Component" /> */}
      {/* <DnDProvider
        list={dndData}
        droppableId="droppable"
        onDragEnd={(result) => console.log(result)}>
        {({ isDragging, dragHandleProps, item }) => {
          console.log(isDragging);
          return <h3 {...dragHandleProps}>{item.title}</h3>;
        }}
      </DnDProvider> */}
      <Divider title="Resizable Component" />
      <Resizeable
        resizeHandles={['s', 'w', 'n', 'e']}
        minConstraints={{ width: 100, height: 100 }}
        maxConstraints={{ width: 500, height: 500 }}
        size={size}
        onResizing={handleOnResizing}
        onResizeStart={handleOnResizeStart}
        onResizeEnd={handleOnResizeEnd}>
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'yellow',
            fontSize: '1.5rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {`width: ${showSize.width}, height: ${showSize.height}`}
        </div>
      </Resizeable>
      <Divider title="End of view" />
    </div>
  );
};

export default RasoulView;

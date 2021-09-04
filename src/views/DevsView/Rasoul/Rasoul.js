import { useEffect, useMemo, useState, useCallback } from 'react';
// import { useSelector } from 'react-redux';
import Divider from './Divider';
// import APIHandler from 'apiHelper/APIHandler';
// import { decodeBase64 } from 'helpers/helpers';

//! CustomTable
import CustomTable from 'components/CustomTable/CustomTable';
import tableData from './tableData';
import ColumnsFactory from 'components/CustomTable/ColumnsFactory';
import DeleteRowIcon from 'components/Icons/DeleteRowIcon/DeleteRowIcon';
import ViewRowIcon from 'components/Icons/ViewIcon/ViewIcon';

//! Dropzone
// import CustomDropzone from 'components/CustomDropzone/CustomDropzone';

//! ProgressBar
import ProgressBar from 'components/ProgressBar/ProgressBar';

//! Custom Tree
// import DnDTree from 'components/Tree/CustomTree/DnDTree';
// import { customTreeData } from './treeData';

//! DragAndDropTree Tree
// import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
// import { DnDTreeData } from './treeData';
// import DragIcon from 'components/Icons/DragIcon/Drag';
// import CaretIcon from 'components/Icons/CaretIcons/Caret';
// import InlineEdit from 'components/InlineEdit/InlineEdit';

//! DnDProvider
// import DnDProvider from 'components/DnDProvider/DnDProvider';
// import dndData from './dndData';

//! Multi Column DnD
// import MultiDnD from 'components/MultiColumnDnD/MultiColumnDnD';

//! Custom Date Picker
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import { Link } from 'react-router-dom';
import {
  USER_CUSTOMIZATION_PATH,
  USER_SECURITY_PATH,
  USER_WITHID_PATH,
} from 'constant/constants';

//! Resizable
// import Resizeable from 'components/Resizable/Resizable';

//! FormElements
// import FormEdit from 'components/FormElements/FormEdit/FormEdit';
// import FormFilter from 'components/FormElements/FormFilter/FormFilter';
// import filters from './filtersObject';

//! DnDGrid
// import DnDGrid from './items/DnDGrid';
// import list from './items/gridData';

// import DnDGridList from 'components/DnDGrid/DnDGrid';

const headers = [
  {
    id: '0',
    title: '#',
    accessor: 'rowIndex',
    dataType: 'index',
    options: {
      editable: false,
      width: 40,
      maxWidth: 40,
      disableSortBy: true,
    },
  },
  {
    id: '1',
    title: 'عنوان',
    accessor: 'firstName',
    dataType: 'single-select',
    options: {
      editable: true,
      disableSortBy: true,
      width: 200,
    },
  },
  {
    id: '2',
    title: 'خانوادگی',
    accessor: 'lastName',
    dataType: 'string',
    options: { editable: true },
  },
  {
    id: '3',
    title: 'کشور',
    accessor: 'country',
    dataType: 'string',
    options: { editable: true, minWidth: 100 },
  },
  {
    id: '4',
    title: 'شهر',
    accessor: 'city',
    dataType: 'string',
    options: { editable: true, minWidth: 80 },
  },
  {
    id: '5',
    title: 'سن',
    accessor: 'age',
    dataType: 'number',
    options: { editable: true, width: 80 },
  },
  {
    id: '6',
    title: 'تاریخ تولد',
    accessor: 'dateOfBirth',
    dataType: 'date',
    options: { editable: true },
  },
  {
    id: '7',
    title: 'پیشرفت',
    accessor: 'progress',
    dataType: 'number',
    options: { editable: true, width: 100, minWidth: 100 },
  },
];

// const initialSize = {
//   width: 200,
//   height: 400,
// };

// const getIcon = (item, onExpand, onCollapse) => {
//   if (item.children && item.children.length > 0) {
//     return item.isExpanded ? (
//       <CaretIcon size={20} onClick={() => onCollapse(item.id)} dir="down" />
//     ) : (
//       <CaretIcon size={20} onClick={() => onExpand(item.id)} dir="left" />
//     );
//   }
//   return null;
// };

const RasoulView = () => {
  console.log('render');
  // const DnDTreeData = useSelector((state) => state.sidebarItems.dndTree);
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState([]);

  const memoizedData = useMemo(() => data, [data]);

  // const [tree, setTree] = useState(DnDTreeData);
  // const [size, setSize] = useState(initialSize);
  // const [showSize, setShowSize] = useState(initialSize);
  // const [form, setForm] = useState({ formId: null, formTitle: null });
  // const [filters, setFilters] = useState([]);

  // const GetFormAPI = new APIHandler('FGAPI', 'GetOwnerForm');
  // const GetFormElementsAPI = new APIHandler('FGAPI', 'GetFormElements');

  // useEffect(() => {
  //   GetFormAPI.fetch(
  //     { OwnerID: '546b88b9-676b-4eea-b6fb-7eca3b24b404' },
  //     (result) => {
  //       console.log(result);
  //       const formId = result.FormID;
  //       const formTitle = decodeBase64(result.Title);
  //       setForm({ formId, formTitle });
  //       GetFormElementsAPI.fetch(
  //         {
  //           FormID: formId,
  //           OwnerID: '546b88b9-676b-4eea-b6fb-7eca3b24b404',
  //           ConsiderElementLimits: true,
  //         },
  //         (response) => {
  //           // const groupingElements = response.Elements.filter((el) => {
  //           //   return ['Select', 'Binary'].some((item) => item === el.Type);
  //           // });
  //           const filters = response.Elements;
  //           setFilters(filters);
  //           console.log(filters);
  //         },
  //         (error) => console.log(error)
  //       );
  //     },
  //     (error) => console.log(error)
  //   );
  // }, []);

  // const PADDING_PER_LEVEL = 32;

  // const handleMutateTree = (tree) => {
  //   setTree(tree);
  // };

  //! Render custom item.
  // const handleRenderItem = ({
  //   item,
  //   onExpand,
  //   onCollapse,
  //   provided,
  //   depth,
  //   snapshot,
  // }) => {
  //   const isDragging = snapshot.isDragging;
  //   const hasChildren = item.hasChildren;
  //   const isEditable = item.isEditable;
  //   return (
  //     <div ref={provided.innerRef} {...provided.draggableProps}>
  //       <div
  //         style={{
  //           display: 'flex',
  //           alignItems: 'center',
  //           margin: '0.7rem 0',
  //           backgroundColor: '#333',
  //           color: '#fff',
  //           padding: '0.5rem 1rem',
  //           borderRadius: 5,
  //           position: 'relative',
  //           right: `${PADDING_PER_LEVEL * depth}px`,
  //         }}>
  //         <div {...provided.dragHandleProps}>
  //           <DragIcon />
  //         </div>
  //         {!isDragging && <span>{getIcon(item, onExpand, onCollapse)}</span>}
  //         <div>
  //           {isEditable ? (
  //             <InlineEdit
  //               text={item.data ? item.data.title : ''}
  //               onSetText={(text) => console.log(text)}
  //             />
  //           ) : (
  //             <span
  //               style={{
  //                 margin: hasChildren ? '0 0.3rem' : '0 0.7rem',
  //               }}>
  //               {item.data ? item.data.title : ''}
  //             </span>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setData(tableData);
      setIsFetching(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedColumns = useMemo(() => ColumnsFactory(headers, data), [data]);

  // const handleOnResizeEnd = (size) => {
  //   setSize(size);
  //   console.log(size, 'resize ended');
  // };

  // const handleOnResizeStart = (size) => {
  //   console.log(size, 'resize started');
  // };

  // const handleOnResizing = (size) => {
  //   setShowSize(size);
  //   console.log(size, 'resizing');
  // };

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

  const removeAll = useCallback(() => {
    setData([]);
  }, []);

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

  return (
    <div>
      {/* <div style={{ textAlign: 'center', fontSize: '1.2rem' }}>
        <Link
          to={USER_WITHID_PATH}
          style={{
            margin: '0 1rem',
            display: 'inline-block',
            borderBottom: '1px solid #333',
          }}>
          پروفایل جدید
        </Link>
        <Link
          to={USER_SECURITY_PATH}
          style={{
            margin: '0 1rem',
            display: 'inline-block',
            borderBottom: '1px solid #333',
          }}>
          امنیت
        </Link>
        <Link
          to={USER_CUSTOMIZATION_PATH}
          style={{
            margin: '0 1rem',
            display: 'inline-block',
            borderBottom: '1px solid #333',
          }}>
          شخصی سازی
        </Link>
      </div> */}
      {/* <div style={{ width: '40%', margin: 'auto', height: '85vh' }}>
        {!!filters.length && (
          <FormFilter
            formName="فیلترهای پیشرفته"
            filters={filters}
            onFilter={(v) => console.log(v)}
          />
        )}
      </div> */}
      {/* <div
        style={{ textAlign: 'center', fontSize: '2rem', marginTop: '15rem' }}>
        Rasoul's view
      </div> */}
      {/* <Divider title="FormEdit Component" />
      <FormEdit>
        {({ onChange }) => {
          //! Render an edit form here.
          return <FormEdit.TextType onChange={onChange} />;
        }}
      </FormEdit> */}

      {/* <Divider title="FormFilter Component" /> */}
      {/* <div style={{ width: '40%', margin: 'auto', height: '50vh' }}>
        {!!filters.length && (
          <FormFilter
            formName="فیلترهای پیشرفته"
            filters={filters}
            onFilter={(v) => console.log(v)}
          />
        )}
      </div> */}
      {/* <Divider title="DnDGrid Component" /> */}
      {/* <div>
        <DnDGrid list={list} />
      </div> */}

      {/* <div>
        <DnDGridList />
      </div> */}

      <Divider title="Custom Table Component" />

      <CustomTable
        editable //! This prop makes the whole table editable.
        resizable //! This prop makes the whole columns of a table resizable.
        // pagination={{
        //   perPageCount: [10, 20, 30, 40],
        //   initialPageIndex: 0,
        // }}
        columns={memoizedColumns}
        data={memoizedData}
        updateCellData={memoizedUpdateCellData}
        reorderData={memoizedReorderData}
        removeRow={memoizedRemoveRow}
        addRow={memoizedAddRow}
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
      {/* <Divider title="Custom Dropzone Component" /> */}
      {/* <CustomDropzone
        accept={['image/*', '.pdf']}
        exceptions={['jpg']}
        maxFiles={3}
        maxEachSize={1}
        maxTotalSize={1}
        onError={(error) => console.log(error)}
        ownerId="40aa835f-751c-4786-86af-fec04f45d262"
        ownerType="Node"
        // disabled
      /> */}
      {/* <Divider title="Custom Progressbar Component" />
      <ProgressBar label="Label" progress={100} /> */}
      {/* <Divider title="Custom Tree Component(broken dnd)" />
      <DnDTree data={customTreeData} /> */}
      {/* <Divider title="Atlasian Tree Component(with dnd)" /> */}
      {/* <div style={{ width: '50%', margin: 'auto' }}>
        <DragAndDropTree
          excludeDrag={['1-2-2']}
          excludeDrop={['1', '1-2']}
          paddingPerLevel={PADDING_PER_LEVEL}
          tree={tree}
          onMutateTree={handleMutateTree}
          renderItem={handleRenderItem}
        />
      </div> */}
      {/* <Divider title="Multi column dnd" />
      <MultiDnD /> */}
      {/* <Divider title="Custom Date Picker" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          height: '400px',
        }}>
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
            size="large"
          />
        </div>
        <div>
          <CustomDatePicker
            label="انتخاب تاریخ با بازه زمانی"
            mode="input"
            type="jalali"
            clearButton
            range
            onDateSelect={(date) => console.log(date)}
            onChangeVisibility={(val) => console.log('show input mode: ' + val)}
          />
        </div>
        <div>
          <CustomDatePicker
            label=" انتخاب تاریخ با بازه زمانی"
            mode="button"
            customButton={({ onClick }) => (
              <div
                onClick={onClick}
                style={{
                  padding: '5px',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}>
                custom button
              </div>
            )}
            type="jalali"
            range
            clearButton
            onDateSelect={(date) => console.log(date)}
            size="small"
            headerTitle="عنوان تقویم"
            onChangeVisibility={(val) =>
              console.log('show button mode: ' + val)
            }
          />
        </div>
      </div> */}

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
      {/* <Divider title="Resizable Component" />
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
      </Resizeable> */}

      <div style={{ marginBottom: '10rem' }}></div>
      <Divider title="End of view" />
    </div>
  );
};

export default RasoulView;

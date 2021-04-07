import EditableCell from 'components/CustomTable/EditableCell';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';

const getCell = (type) => {
  switch (type) {
    case 'string':
      return { Cell: EditableCell };

    case 'date':
      return {
        Cell: (row) => (
          <CustomDatePicker
            label="انتخاب تاریخ"
            mode="input"
            type="jalali"
            range={false}
            size="small"
            value={row.value}
            style={{ color: 'white' }}
            inputStyle={{ color: 'inherit' }}
          />
        ),
      };

    default:
      return;
  }
};

const makeColumns = (headers, actions) => {
  let tableColumns = [];
  if (actions && Object.keys(actions).length !== 0) {
    const deleteCell = {
      id: 'actions',
      dataType: 'actions',
      Header: 'اقدامات',
      Cell: ({ row }) => actions.delete(row.index),
      width: 60,
    };
    tableColumns.push(deleteCell);
  }
  console.log(headers, 'make columns');
  const dataCulomns = headers.map((header) => {
    return {
      Header: Object.values(header)[0],
      accessor: Object.keys(header)[0],
      ...getCell(header.dataType),
    };
  });

  return tableColumns.concat(dataCulomns);
};

export default makeColumns;

// {
//   Header: 'تاریخ تولد',
//   accessor: (row) => row.dateOfBirth,
//   dataType: 'date',
// },
// {
//   Header: 'پیشرفت پروفایل',
//   accessor: (row) => {
//     console.log(row, 'accessor');
//     return row.progress;
//   },
//   dataType: 'string',
//   Cell: (row) => {
//     console.log(row, 'cell');
//     return row.value;
//   },
// },

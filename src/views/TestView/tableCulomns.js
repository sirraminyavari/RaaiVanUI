const tableCulomns = [
  {
    Header: 'نام',
    accessor: 'firstName',
    dataType: 'string',
  },
  {
    Header: 'نام خانوادگی',
    accessor: 'lastName',
    dataType: 'string',
  },
  {
    Header: 'کشور',
    accessor: 'country',
    dataType: 'string',
  },
  {
    Header: 'شهر',
    accessor: 'city',
    dataType: 'string',
  },
  {
    Header: 'سن',
    accessor: 'age',
    dataType: 'string',
  },
  {
    Header: 'تاریخ تولد',
    accessor: (row) => row.dateOfBirth.data,
    dataType: 'date',
  },
  {
    Header: 'پیشرفت پروفایل',
    accessor: (row) => {
      console.log(row, 'accessor');
      return row.progress;
    },
    dataType: 'string',
    Cell: (row) => {
      console.log(row, 'cell');
      return row.value;
    },
  },
];

export default tableCulomns;

export const COLUMNS = [
  // {
  //   Header: 'نام تیم',
  //   accessor: 'Name',
  // },
  // {
  //   Header: 'تاریخ عضویت',
  //   accessor: 'date',
  // },
  // {
  //   Header: 'تعداد اعضا',
  //   accessor: 'number',
  // },
  {
    Header: <div style={{ textAlign: 'center' }}>لوگو</div>,
    Cell: ({ value }) => (
      <div style={{ textAlign: 'center', alignItems: 'center' }}>
        {' '}
        <img src={`${value}`} style={{ width: '2rem' }} />{' '}
      </div>
    ),
    accessor: 'IconURL',
  },

  {
    Header: <div style={{ textAlign: 'center' }}>نام تیم </div>,
    Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,
    accessor: 'Title',
  },

  {
    Header: <div style={{ textAlign: 'center' }}> تاریخ عضویت </div>,
    Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,
    accessor: 'CreationDate_Local',
  },
  {
    Header: <div style={{ textAlign: 'center' }}>تاریخ آخرین فعالیت</div>,
    Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,
    accessor: 'LastActivityTime_Local',
  },
  {
    Header: (
      <div style={{ textAlign: 'center' }}> تعداد ورود در 30روز گذشته </div>
    ),
    Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,
    accessor: 'LoginsCount',
  },
];

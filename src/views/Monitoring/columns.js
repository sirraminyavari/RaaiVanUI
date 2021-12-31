export const COLUMNS = [
  {
    Header: <div style={{ textAlign: 'center' }}>لوگو</div>,
    Cell: ({ value }) => (
      <div style={{ textAlign: 'center', alignItems: 'center' }}>
        {' '}
        <img
          src={`http://cliqmind-dev.ir/${value}`}
          style={{ width: '2rem' }}
        />{' '}
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
    Header: <div style={{ textAlign: 'center' }}> تاریخ آخرین فعالیت تیم </div>,
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

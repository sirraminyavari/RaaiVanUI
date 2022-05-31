const { RVDic } = window;

export const COLUMNS = [
  {
    Header: <div style={{ textAlign: 'center' }}> {RVDic?.Logo} </div>,
    Cell: ({ value }) => (
      <div style={{ textAlign: 'center', alignItems: 'center' }}>
        {' '}
        <img src={`${value}`} style={{ width: '2rem' }} alt="" />{' '}
      </div>
    ),
    accessor: 'IconURL',
  },

  {
    Header: <div style={{ textAlign: 'center' }}> {RVDic?.TeamName} </div>,
    Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,
    accessor: 'Title',
  },

  {
    Header: (
      <div style={{ textAlign: 'center' }}> {RVDic?.MembershipDate} </div>
    ),
    Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,
    accessor: 'CreationDate_Local',
  },
  {
    Header: (
      <div style={{ textAlign: 'center' }}> {RVDic?.LastActivityTime} </div>
    ),
    Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,
    accessor: 'LastActivityTime_Local',
  },
  {
    Header: (
      <div style={{ textAlign: 'center' }}>
        {' '}
        {RVDic.NumberOfLoginsInTheLastNDays.replace('[n]', 30)}{' '}
      </div>
    ),
    Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,
    accessor: 'LoginsCount',
  },
];

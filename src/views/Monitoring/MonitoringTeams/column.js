const { RVDic } = window;

export const COLUMNS = [
  {
    Header: <div style={{ textAlign: 'center' }}> {RVDic?.Logo} </div>,
    Cell: ({ value }) => (
      <div style={{ textAlign: 'center', alignItems: 'center' }}>
        {' '}
        <img src={`${value}`} style={{ width: '2rem' }} />{' '}
      </div>
    ),
    accessor: 'ProfileImageURL',
  },

  {
    Header: <div style={{ textAlign: 'center' }}> {RVDic?.FullName} </div>,
    Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,
    accessor: 'FullName',
  },

  {
    Header: <div style={{ textAlign: 'center' }}> {RVDic?.Email} </div>,
    Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,
    accessor: 'MainEmailAddress',
  },
  {
    Header: (
      <div style={{ textAlign: 'center' }}> {RVDic?.LastActivityTime} </div>
    ),
    Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,
    accessor: 'LastActivityTime_Local',
  },
];

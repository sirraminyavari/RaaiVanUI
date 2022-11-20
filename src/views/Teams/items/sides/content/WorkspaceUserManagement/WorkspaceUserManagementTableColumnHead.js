import useWindow from 'hooks/useWindowContext';
function WorkspaceUserManagementTableColumnHead({ isMobile }) {
  const { RVDic } = useWindow();

  const RVDicFullName = RVDic.FullName;
  const RVDicTeams = RVDic.Teams;
  const RVDicLastActivityTime = RVDic.LastActivityTime;
  return [
    {
      Header: '',
      accessor: 'col1',
    },
    {
      Header: RVDicFullName,
      accessor: 'col2',
    },
    //* remove [col2] and [col3] of the table on mobile view
    ...(!isMobile
      ? [
          {
            Header: `${RVDic.Mobile}/${RVDic.Email}`,
            accessor: 'col3',
          },
          {
            Header: RVDicLastActivityTime,
            accessor: 'col4',
          },
        ]
      : []),
    {
      Header: RVDicTeams,
      accessor: 'col5',
    },
    {
      Header: '',
      accessor: 'col6',
    },
  ];
}

export default WorkspaceUserManagementTableColumnHead;

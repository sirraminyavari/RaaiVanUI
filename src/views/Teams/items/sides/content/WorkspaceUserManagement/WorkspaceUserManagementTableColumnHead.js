import useWindow from 'hooks/useWindowContext';
function WorkspaceUserManagementTableColumnHead({ isMobile }) {
  const { RVDic } = useWindow();

  const RVDicFullName = RVDic.FullName;
  const RVDicTeams = RVDic.Teams;
  const RVDicLastActivityTime = RVDic.LastActivityTime;
  return [
    {
      Header: RVDicFullName,
      accessor: 'col1',
    },
    //* remove [col2] and [col3] of the table on mobile view
    ...(!isMobile
      ? [
          {
            Header: `${RVDic.Mobile}/${RVDic.Email}`,
            accessor: 'col2',
          },
          {
            Header: RVDicLastActivityTime,
            accessor: 'col3',
          },
        ]
      : []),
    {
      Header: RVDicTeams,
      accessor: 'col4',
    },
    {
      Header: '',
      accessor: 'col5',
    },
  ];
}

export default WorkspaceUserManagementTableColumnHead;

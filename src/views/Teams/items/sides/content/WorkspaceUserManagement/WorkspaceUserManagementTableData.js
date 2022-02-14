import Avatar from 'components/Avatar/Avatar';
import Button from 'components/Buttons/Button';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import { decodeBase64 } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';
import { memo } from 'react';
import WorkspaceUserManagementExtraTeamsList from './WorkspaceUserManagementList';

function WorkspaceUserManagementTableData({
  workspaceUsers,
  isMobile,
  setRemovableUser,
}) {
  const { RVDic } = useWindow();

  const RVDicRemoveFromAllTeams = RVDic.RemoveFromAllTeams;
  return workspaceUsers?.map(({ Applications, User }) => {
    return {
      col1: (
        <>
          <Avatar className="userAvatar" userImage={User.ImageURL} />
          {decodeBase64(User.FullName)}
        </>
      ),
      //* remove [col2] and [col3] of the table on mobile view
      ...(!isMobile && {
        col2: decodeBase64(User.MainEmailAddress),
        col3: decodeBase64(User.LastActivityTime_Local),
      }),
      col4: Applications.map(
        ({ ApplicationID, Title, IconURL }, idx, ApplicationsArray) => {
          if (idx < 5)
            return (
              <Tooltip
                effect="solid"
                place="bottom"
                tipId={ApplicationID}
                key={ApplicationID || idx}
                renderContent={() => decodeBase64(Title)}>
                <Avatar imageClasses="teamAvatar" userImage={IconURL} />
              </Tooltip>
            );
          else if (idx === 5)
            return (
              <>
                <WorkspaceUserManagementExtraTeamsList
                  Applications={ApplicationsArray}
                />
              </>
            );
          return;
        }
      ),
      col5: (
        <Button
          type="negative-o"
          key={User.MainEmailAddress}
          onClick={() => setRemovableUser(User)}
          style={{ padding: '0.25rem 1rem' }}>
          {RVDicRemoveFromAllTeams}
        </Button>
      ),
      col6: '',
    };
  });
}

export default WorkspaceUserManagementTableData;

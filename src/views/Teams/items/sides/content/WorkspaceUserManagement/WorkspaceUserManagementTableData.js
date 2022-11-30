import AvatarComponent from 'components/Avatar/Avatar';
import WithAvatar from 'components/Avatar/WithAvatar';
import Button from 'components/Buttons/Button';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import { decodeBase64 } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';
import WorkspaceUserManagementExtraTeamsList from './WorkspaceUserManagementList';

const Avatar = WithAvatar({
  Component: AvatarComponent,
  componentURLProp: 'userImage',
});

function WorkspaceUserManagementTableData({
  workspaceUsers,
  isMobile,
  setRemovableUser,
}) {
  const { RVDic, GlobalUtilities } = useWindow();

  const RVDicRemoveFromAllTeams = RVDic.RemoveFromAllTeams;
  return workspaceUsers?.map(({ Applications, User }) => {
    return {
      col1: (
        <>
          <Avatar
            className="userAvatar"
            userImage={GlobalUtilities.add_timestamp(User.ImageURL)}
            userObject={User}
          />
        </>
      ),
      col2: <>{decodeBase64(User.FullName)}</>,
      //* remove [col2] and [col3] of the table on mobile view
      ...(!isMobile && {
        col3: decodeBase64(User.MainEmailAddress),
        col4: decodeBase64(User.LastActivityTime_Local),
      }),
      col5: Applications.map(
        ({ ApplicationID, Title, IconURL }, idx, ApplicationsArray) => {
          if (idx < 5)
            return (
              <Tooltip
                effect="solid"
                place="bottom"
                tipId={ApplicationID}
                key={ApplicationID || idx}
                renderContent={() => decodeBase64(Title)}
              >
                <Avatar
                  imageClasses="teamAvatar"
                  userImage={GlobalUtilities.add_timestamp(IconURL)}
                />
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
      col6: (
        <Button
          type="negative-o"
          key={User.MainEmailAddress}
          onClick={() => setRemovableUser(User)}
          style={{ padding: '0.25rem 1rem' }}
        >
          {RVDicRemoveFromAllTeams}
        </Button>
      ),
      col7: '',
    };
  });
}

export default WorkspaceUserManagementTableData;

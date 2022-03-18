import { useRef } from 'react';
import * as Styled from './WorkspaceTeamCard.styles';
import UserPlusIcon from 'components/Icons/UserPlusIcon/UserPlus';
import useWindow from 'hooks/useWindowContext';
import { TCV_DEFAULT } from 'constant/CssVariables';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import AvatarComponent from 'components/Avatar/Avatar';
import { decodeBase64 } from 'helpers/helpers';
import usePreventScroll from 'hooks/usePreventScroll';
import WithAvatar from 'components/Avatar/WithAvatar';

const Avatar = WithAvatar({
  Component: AvatarComponent,
  componentURLProp: 'userImage',
});

const ExtraUsersList = ({ handleInviteUser, isAdmin, users }) => {
  const containerRef = useRef();
  const { RV_RTL, GlobalUtilities, RVDic } = useWindow();

  usePreventScroll(containerRef);

  return (
    <div ref={containerRef}>
      {isAdmin && (
        <Styled.ExtraUsersPopupHeader onClick={handleInviteUser}>
          <Styled.AddUserWrapper
            style={{
              width: '2rem',
              height: '2rem',
              lineHeight: '2.5rem',
            }}
            rtl={RV_RTL}
          >
            <UserPlusIcon
              size={16}
              color={TCV_DEFAULT}
              style={{ marginLeft: '0.3rem' }}
            />
          </Styled.AddUserWrapper>
          <Styled.ExtraUsersPopupTitle>
            {RVDic.InviteNewTeamMate}
          </Styled.ExtraUsersPopupTitle>
        </Styled.ExtraUsersPopupHeader>
      )}
      <ScrollBarProvider style={{ height: '8rem' }}>
        <div
          style={{
            minHeight: '9rem',
          }}
        >
          {users
            ?.filter((user, index) => index > 3 && user)
            .map((user) => {
              const fullName = `${decodeBase64(user.FirstName)} ${decodeBase64(
                user?.LastName
              )}`;
              return (
                <Styled.ExtraUserItem key={user?.UserID}>
                  <Avatar
                    userImage={GlobalUtilities.add_timestamp(
                      user?.ProfileImageURL
                    )}
                    radius={25}
                    userObject={user}
                  />
                  <Styled.ExtraUserTitle>{fullName}</Styled.ExtraUserTitle>
                </Styled.ExtraUserItem>
              );
            })}

          {/* [...Array(10).keys()].map((test) => {
            return (
              <Styled.ExtraUserItem key={test}>
                <Avatar radius={25} color="#333" />
                <Styled.ExtraUserTitle>{'fullName'}</Styled.ExtraUserTitle>
              </Styled.ExtraUserItem>
            );
          }) */}
        </div>
      </ScrollBarProvider>
    </div>
  );
};

export default ExtraUsersList;

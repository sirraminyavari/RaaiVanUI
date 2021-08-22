import { useRef } from 'react';
import * as Styled from 'views/Teams/Teams.styles';
import UserPlusIcon from 'components/Icons/UserPlusIcon/UserPlus';
import useWindow from 'hooks/useWindowContext';
import { TCV_DEFAULT } from 'constant/CssVariables';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import Avatar from 'components/Avatar/Avatar';
import { decodeBase64 } from 'helpers/helpers';
import usePreventScroll from 'hooks/usePreventScroll';

const ExtraUsersList = ({ handleInviteUser, users }) => {
  const containerRef = useRef();
  const { RV_RTL, RVGlobal } = useWindow();

  const isAdmin = (RVGlobal || {}).IsSystemAdmin;

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
            rtl={RV_RTL}>
            <UserPlusIcon
              size={16}
              color={TCV_DEFAULT}
              style={{ marginLeft: '0.3rem' }}
            />
          </Styled.AddUserWrapper>
          <Styled.ExtraUsersPopupTitle>
            افزودن هم تیمی جدید
          </Styled.ExtraUsersPopupTitle>
        </Styled.ExtraUsersPopupHeader>
      )}
      <PerfectScrollbar className="extra-users-scrollbar">
        {users
          ?.filter((user, index) => index > 3 && user)
          .map((user) => {
            const fullName = `${decodeBase64(user.FirstName)} ${decodeBase64(
              user?.LastName
            )}`;
            return (
              <Styled.ExtraUserItem key={user?.UserID}>
                <Avatar userImage={user?.ProfileImageURL} radius={25} />
                <Styled.ExtraUserTitle>{fullName}</Styled.ExtraUserTitle>
              </Styled.ExtraUserItem>
            );
          })}
        {/* {[...Array(10).keys()].map((test) => {
          return (
            <Styled.ExtraUserItem key={test}>
              <Avatar radius={25} color="#333" />
              <Styled.ExtraUserTitle>{'fullName'}</Styled.ExtraUserTitle>
            </Styled.ExtraUserItem>
          );
        })} */}
      </PerfectScrollbar>
    </div>
  );
};

export default ExtraUsersList;

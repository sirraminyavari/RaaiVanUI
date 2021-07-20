import { useLayoutEffect, useRef } from 'react';
import * as Styled from 'views/Teams/Teams.styles';
import UserPlusIcon from 'components/Icons/UserPlusIcon/UserPlus';
import useWindow from 'hooks/useWindowContext';
import { TCV_DEFAULT } from 'constant/CssVariables';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import Avatar from 'components/Avatar/Avatar';
import { decodeBase64 } from 'helpers/helpers';

const ExtraUsersList = ({ handleInviteUser, users }) => {
  const { RV_RTL } = useWindow();
  const containerRef = useRef();

  useLayoutEffect(() => {
    const containerNode = containerRef.current;
    const preventScroll = (e) => e.preventDefault();
    containerNode.addEventListener('mousewheel', preventScroll);

    //! Clean up
    return () => {
      containerNode.removeEventListener('mousewheel', preventScroll);
    };
  }, []);

  return (
    <div ref={containerRef}>
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

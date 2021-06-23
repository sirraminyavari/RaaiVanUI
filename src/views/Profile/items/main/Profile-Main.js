import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from 'views/Profile/Profile.styles';
import Avatar from 'components/Avatar/Avatar';
import PencilIcon from 'components/Icons/EditIcons/Pencil';
import useHover from 'hooks/useHover';

const selectAuthUser = createSelector(
  (state) => state.auth,
  (auth) => auth.authUser
);

const ProfileMain = () => {
  const authUser = useSelector(selectAuthUser);

  return (
    <Styled.ProfileViewContainer style={{ padding: 0 }}>
      <Styled.ProfileHeader>
        <Styled.ProfileAvatarWrapper>
          <Avatar
            userImage={authUser?.ProfileImageURL}
            radius={90}
            className="profile-avatar"
          />
          <Styled.AvatarPencilWrapper>
            <PencilIcon color="#fff" size={18} />
          </Styled.AvatarPencilWrapper>
        </Styled.ProfileAvatarWrapper>
        <Styled.HeaderPencilWrapper>
          <PencilIcon color="#fff" size={18} />
        </Styled.HeaderPencilWrapper>
      </Styled.ProfileHeader>
      <Styled.MainWrapper>
        <Styled.ProfileInfoWrapper>profile info</Styled.ProfileInfoWrapper>
      </Styled.MainWrapper>
    </Styled.ProfileViewContainer>
  );
};

export default ProfileMain;

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from 'views/Profile/Profile.styles';
import Avatar from 'components/Avatar/Avatar';
import PencilIcon from 'components/Icons/EditIcons/Pencil';
import Modal from 'components/Modal/Modal';
import ImageCropper from './items/ImageCropper';
import Clouds from 'assets/images/clouds.png';
import UserInfos from './items/UserInfos';
import HeaderStatus from './items/HeaderStatus';
import LastTopics from './items/LastTopics';
import LastPosts from './items/LastPosts';
import { themeSlice } from 'store/reducers/themeReducer';
import { MAIN_CONTENT, PROFILE_CONTENT } from 'constant/constants';

const { setSidebarContent } = themeSlice.actions;

const selectAuthUser = createSelector(
  (state) => state.auth,
  (auth) => auth.authUser
);

const ProfileMain = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const [cropModal, setCropModal] = useState({
    isShown: false,
    title: '',
    aspect: 1 / 1,
    imgSrc: null,
  });

  const handleAvatarEdit = () => {
    setCropModal((m) => ({
      ...m,
      isShown: true,
      title: 'Crop avatar',
      aspect: 1 / 1,
      imgSrc: authUser?.ProfileImageURL,
    }));
  };

  const handleHeaderEdit = () => {
    setCropModal((m) => ({
      ...m,
      isShown: true,
      title: 'Crop header',
      aspect: 5 / 1,
      imgSrc: Clouds,
    }));
  };

  const handleCloseModal = () => {
    setCropModal((m) => ({ ...m, isShown: false }));
  };

  useEffect(() => {
    dispatch(
      setSidebarContent({
        current: PROFILE_CONTENT,
        prev: MAIN_CONTENT,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Styled.ProfileViewContainer style={{ padding: 0 }}>
      <Modal
        show={cropModal?.isShown}
        onClose={handleCloseModal}
        contentWidth="70%"
        title={cropModal?.title}>
        <div style={{ widht: '100%', height: '100%', textAlign: 'center' }}>
          <ImageCropper imgSrc={cropModal?.imgSrc} aspect={cropModal?.aspect} />
        </div>
      </Modal>
      <Styled.ProfileHeader>
        <Styled.ProfileAvatarWrapper>
          <Avatar
            userImage={authUser?.ProfileImageURL}
            radius={95}
            className="profile-avatar"
          />
          <Styled.AvatarPencilWrapper onClick={handleAvatarEdit}>
            <PencilIcon color="#fff" size={18} />
          </Styled.AvatarPencilWrapper>
        </Styled.ProfileAvatarWrapper>
        <Styled.HeaderPencilWrapper onClick={handleHeaderEdit}>
          <PencilIcon color="#fff" size={18} />
        </Styled.HeaderPencilWrapper>
      </Styled.ProfileHeader>
      <Styled.MainWrapper>
        <UserInfos />
        <div>
          <HeaderStatus />
          <LastTopics />
          <LastPosts />
        </div>
      </Styled.MainWrapper>
    </Styled.ProfileViewContainer>
  );
};

export default ProfileMain;

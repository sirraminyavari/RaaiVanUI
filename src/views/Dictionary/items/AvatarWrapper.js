import AvatarComponent from 'components/Avatar/Avatar';
import { selectAuth } from 'store/slice/auth/selectors';
import { useSelector, useDispatch } from 'react-redux';
import defaultProfileImage from 'assets/images/default-profile-photo.png';
import WithAvatar from 'components/Avatar/WithAvatar';
import AvatarMenuList from 'layouts/Navbar/items/AvatarMenu/AvatarMenuList';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import styled from 'styled-components';
import { CV_WHITE, TCV_VERY_TRANSPARENT } from 'constant/CssVariables';

const Avatar = WithAvatar({
  Component: AvatarComponent,
  componentURLProp: 'userImage',
});

const UNKNOWN_IMAGE = '../../Images/unknown.jpg';

const AvatarWrapper = () => {
  const { authUser } = useSelector(selectAuth);
  const { RV_RevFloat, GlobalUtilities } = window;
  const profileImage =
    authUser?.ProfileImageURL === UNKNOWN_IMAGE
      ? defaultProfileImage
      : GlobalUtilities.add_timestamp(authUser?.ProfileImageURL);

  return (
    <Container>
      <Tooltip
        tipId="nav-avatar-menu"
        multiline
        effect="solid"
        clickable
        event="click"
        arrowColor="transparent"
        offset={{ [RV_RevFloat]: -100, top: -6 }}
        className="avatar-tooltip"
        renderContent={() => {
          return <AvatarMenuList />;
        }}
      >
        <Avatar
          radius={35}
          userImage={profileImage}
          userObject={authUser}
          className="navbar-avatar"
        />
      </Tooltip>
    </Container>
  );
};
const Container = styled.div`
  .avatar-tooltip {
    background-color: ${CV_WHITE} !important;
    opacity: 1 !important;
    box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT} !important;
    padding: 0 !important;
    border-radius: 0.8rem !important;
  }
`;
export default AvatarWrapper;

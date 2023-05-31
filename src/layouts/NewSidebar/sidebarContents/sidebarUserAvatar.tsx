import {
  Avatar,
  CaretSvg,
  RVColorProp,
  RVSizeProp,
  RVVariantProp,
} from '@cliqmind/rv-components';
import WithAvatar from 'components/Avatar/WithAvatar';
import Button from 'components/Buttons/Button';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import { PROFILE_USER } from 'constant/constants';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectAuth } from 'store/slice/auth/selectors';

const AvatarUser = WithAvatar({
  Component: Avatar,
  componentURLProp: 'src',
});

const SidebarUserAvatar = (props: Record<string, any>) => {
  const { authUser } = useSelector(selectAuth);
  return (
    <Tooltip
      tipId={`sidebar-menu-avatar`}
      effect="solid"
      event="click"
      clickable
      place={'top'}
      offset={{ top: 0, right: 0, left: 0 }}
      arrowColor="transparent"
      backgroundColor="transparent"
      renderContent={UserAvatarPopupMenu}
    >
      <div
        style={{
          display: 'flex',
          gap: '.125rem',
          alignItems: 'center',
          maxWidth: '2rem',
        }}
      >
        <AvatarUser
          color={RVColorProp.inherit}
          variant={RVVariantProp.outline}
          size={RVSizeProp.small}
          style={{
            textAlign: 'center',
            marginInline: 'auto',
            cursor: 'pointer',
            width: '1.7rem',
            padding: 0,
            borderStyle: 'none',
          }}
          userObject={authUser}
          {...props}
        />
        <CaretSvg size="1em" direction="down" style={{ flexShrink: 0 }} />
      </div>
    </Tooltip>
  );
};

export default SidebarUserAvatar;

const UserAvatarPopupMenu = () => {
  const history = useHistory();
  return (
    <div
      style={{
        zIndex: 1000,
        borderRadius: '.7rem',
        padding: '.25rem 5.rem',
        backgroundColor: 'hsl(var(--light))',
        display: 'flex',
        gap: '.5rem',
      }}
      className={RVColorProp.distant}
    >
      <Button onClick={() => history.push(`/${PROFILE_USER}`)}>profile</Button>
      <Button>logout</Button>
    </div>
  );
};

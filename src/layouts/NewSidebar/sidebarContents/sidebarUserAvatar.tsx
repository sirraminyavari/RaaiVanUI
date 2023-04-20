import {
  Avatar,
  RVColorProp,
  RVSizeProp,
  RVVariantProp,
} from '@cliqmind/rv-components';
import WithAvatar from 'components/Avatar/WithAvatar';
import { useSelector } from 'react-redux';
import { selectAuth } from 'store/slice/auth/selectors';

const AvatarUser = WithAvatar({
  Component: Avatar,
  componentURLProp: 'src',
});

const SidebarUserAvatar = (props: Record<string, any>) => {
  const { authUser } = useSelector(selectAuth);
  return (
    <AvatarUser
      color={RVColorProp.inherit}
      variant={RVVariantProp.outline}
      size={RVSizeProp.small}
      style={{
        textAlign: 'center',
        marginInline: 'auto',
        cursor: 'pointer',
        width: '2rem',
        padding: 0,
        borderStyle: 'none',
      }}
      userObject={authUser}
      {...props}
    />
  );
};

export default SidebarUserAvatar;

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
      size={RVSizeProp.medium}
      style={{
        textAlign: 'center',
        marginInline: 'auto',
        paddingBlock: '.5rem',
        cursor: 'pointer',
        width: '4rem',
        marginBottom: '1rem',
      }}
      userObject={authUser}
      {...props}
    />
  );
};

export default SidebarUserAvatar;

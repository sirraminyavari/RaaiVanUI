import {
  Avatar,
  CaretSvg,
  RVColorProp,
  RVSizeProp,
  RVVariantProp,
} from '@cliqmind/rv-components';
import WithAvatar from 'components/Avatar/WithAvatar';
import Button from 'components/Buttons/Button';
import { PROFILE_USER } from 'constant/constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth } from 'store/slice/auth/selectors';
import { useAuthSlice } from 'store/slice/auth';
import Popover from '@mui/base/PopperUnstyled';
import { useState } from 'react';
import styles from './sidebarUserAvatar.module.scss';
import clsx from 'clsx';

const AvatarUser = WithAvatar({
  Component: Avatar,
  componentURLProp: 'src',
});

const SidebarUserAvatar = ({ history, ...props }: Record<string, any>) => {
  const { authUser } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement>();

  const { actions: authActions } = useAuthSlice();

  const onLogoutDone = () => {};

  const onLogoutError = (logoutError) => {
    console.log(logoutError);
  };

  //! Logs user out from application.
  const handleLogout = () => {
    dispatch(authActions.logout({ done: onLogoutDone, error: onLogoutError }));
    setOpen((prev) => !prev);
  };
  return (
    <>
      <div
        className={styles.userAvatarContainer}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
          setOpen((prev) => !prev);
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
      <Popover
        open={open}
        anchorEl={anchorEl}
        popperOptions={{ placement: 'top' }}
        placement="auto"
      >
        <div
          className={clsx(RVColorProp.platinum, styles.userAvatarDropdownPanel)}
        >
          <Button
            onClick={() => {
              history.push(`/${PROFILE_USER}`);
              setOpen((prev) => !prev);
            }}
            color={RVColorProp.platinum}
          >
            Profile
          </Button>
          <Button color={RVColorProp.platinum} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Popover>
    </>
  );
};

export default SidebarUserAvatar;

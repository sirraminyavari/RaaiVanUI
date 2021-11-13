/**
 * Renders whole navbar area for app.
 */
import { lazy, Suspense, memo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import { useMediaQuery } from 'react-responsive';
import Avatar from 'components/Avatar/Avatar';
import NavbarSearchInput from './items/SearchInput';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import AvatarMenuList from './items/AvatarMenu/AvatarMenuList';
import {
  WIDE_BOUNDRY,
  MEDIUM_BOUNDRY,
  MOBILE_BOUNDRY,
  GET_NOTIFS_INTERVAL,
  TEAMS_PATH,
} from 'constant/constants';
import { C_WHITE } from 'constant/Colors';
import useWindow from 'hooks/useWindowContext';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import useInterval from 'hooks/useInterval';
import { getNotificationsCount } from 'store/actions/global/NotificationActions';
import defaultProfileImage from 'assets/images/default-profile-photo.png';

const WideScreenMenu = lazy(() =>
  import(
    /* webpackChunkName: "nav-wide-screen-menu-component"*/ './items/ScreenMenu'
  )
);
const MobileMenu = lazy(() =>
  import(
    /* webpackChunkName: "nav-mobile-menu-component"*/ './items/MobileMenu'
  )
);

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const selectActivePath = createSelector(
  (state) => state.theme,
  (theme) => theme.activePath
);

const selectAuthUser = createSelector(
  (state) => state.auth,
  (auth) => auth.authUser
);

const UNKNOWN_IMAGE = '../../Images/unknown.jpg';

const NavbarPlaceholder = () => <div />;

const Navbar = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const activePath = useSelector(selectActivePath);
  const authUser = useSelector(selectAuthUser);
  const [showSearch, setShowSearch] = useState(false);
  const { RVDic, RV_RevFloat, GlobalUtilities } = useWindow();

  const profileImage =
    authUser?.ProfileImageURL === UNKNOWN_IMAGE
      ? defaultProfileImage
      : GlobalUtilities.add_timestamp(authUser?.ProfileImageURL);

  const isTeamsView = activePath === TEAMS_PATH;

  const getNotifs = () => {
    dispatch(getNotificationsCount());
  };

  useInterval(getNotifs, GET_NOTIFS_INTERVAL);
  useEffect(getNotifs, [dispatch]);

  const isWideScreen = useMediaQuery({ query: `(min-width: ${WIDE_BOUNDRY})` });
  const isMediumScreen = useMediaQuery({
    query: `(min-width: ${MEDIUM_BOUNDRY})`,
  });
  const isMobileScreen = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  });
  const isMobileNav = useMediaQuery({
    query: '(max-width: 970px)',
  });

  const showInput = () => {
    if (!isSidebarOpen && (isMediumScreen || isWideScreen)) return true;
    if (isSidebarOpen && isWideScreen) return true;
    return showSearch;
  };

  const getNavMenu = () => {
    if (!isSidebarOpen && isMobileScreen) return <MobileMenu />;
    if (isSidebarOpen && isMobileNav) return <MobileMenu />;
    if (showSearch) return <MobileMenu />;
    return <WideScreenMenu />;
  };

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  const handleHideSearch = () => {
    setShowSearch(false);
  };

  const SearchPlaceholder = RVDic.SearchInN.replace('[n]', RVDic.Team);

  return (
    <Styled.NavbarContainer isMobile={isMobileScreen}>
      <Suspense fallback={<Styled.NavMenuContainer />}>
        {isTeamsView ? <NavbarPlaceholder /> : getNavMenu()}
      </Suspense>
      <Styled.SearchWrapper>
        {showInput() ? (
          <NavbarSearchInput
            onBlur={handleHideSearch}
            autoFocus={showSearch}
            placeholder={SearchPlaceholder}
          />
        ) : (
          <SearchIcon
            size={30}
            className={C_WHITE}
            style={{ margin: '0.5rem 1.5rem 0 1.5rem', cursor: 'pointer' }}
            onClick={handleShowSearch}
          />
        )}
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
          }}>
          <Avatar
            radius={35}
            userImage={profileImage}
            className="navbar-avatar"
          />
        </Tooltip>
      </Styled.SearchWrapper>
    </Styled.NavbarContainer>
  );
};

export default memo(Navbar);

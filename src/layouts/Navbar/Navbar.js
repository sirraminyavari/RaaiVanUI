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
  BO_RADIUS_UNIT,
  BO_RADIUS_QUARTER,
} from 'constant/constants';
import { BG_WHITE, C_WHITE } from 'constant/Colors';
import useWindow from 'hooks/useWindowContext';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import useInterval from 'hooks/useInterval';
import {
  getNotificationsCount,
  // getNotificationsList,
} from 'store/actions/global/NotificationActions';

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

const NavbarPlaceholder = () => <div />;

const Navbar = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const activePath = useSelector(selectActivePath);
  const authUser = useSelector(selectAuthUser);
  const [showSearch, setShowSearch] = useState(false);
  const { RVDic, RV_RevFloat } = useWindow();

  const isTeamsView = activePath === TEAMS_PATH;

  const getNotifs = () => {
    dispatch(getNotificationsCount());
    // dispatch(getNotificationsList());
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
          offset={{ [RV_RevFloat]: -102, top: -6 }}
          className="avatar-tooltip"
          renderContent={() => {
            return <AvatarMenuList />;
          }}>
          <Avatar
            radius={35}
            userImage={authUser?.ProfileImageURL}
            style={{ cursor: 'pointer', minWidth: '2.5rem' }}
          />
        </Tooltip>
      </Styled.SearchWrapper>
    </Styled.NavbarContainer>
  );
};

export default memo(Navbar);

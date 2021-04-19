/**
 * Renders whole navbar area for app.
 */
import { lazy, Suspense, memo, useContext } from 'react';
import { useSelector } from 'react-redux';
import Avatar from 'components/Avatar/Avatar';
import NavbarSearchInput from './components/NavSearchInput';
import * as Styled from './Navbar.styles';
import { useMediaQuery } from 'react-responsive';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import AvatarMenuList from './components/AvatarMenu/AvatarMenuList';
import { createSelector } from 'reselect';
import {
  WIDE_BOUNDRY,
  MEDIUM_BOUNDRY,
  MOBILE_BOUNDRY,
} from 'constant/constants';
import { BG_WARM } from 'constant/Colors';
import { WindowContext } from 'context/WindowProvider';

const NavWideScreenMenu = lazy(() =>
  import(
    /* webpackChunkName: "nav-wide-screen-menu-component"*/ './components/NavWideScreenMenu'
  )
);
const NavMobileMenu = lazy(() =>
  import(
    /* webpackChunkName: "nav-mobile-menu-component"*/ './components/NavMobileMenu'
  )
);

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const Navbar = () => {
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const { RV_Direction } = useContext(WindowContext);

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
    return false;
  };

  const showMobileNav = () => {
    if (!isSidebarOpen && isMobileScreen) return true;
    if (isSidebarOpen && isMobileNav) return true;
    return false;
  };

  return (
    <Styled.NavbarContainer className={BG_WARM} isMobile={isMobileScreen}>
      <Suspense fallback={<Styled.NavMenuContainer />}>
        {showMobileNav() ? <NavMobileMenu /> : <NavWideScreenMenu />}
      </Suspense>
      <Styled.SearchWrapper>
        {showInput() ? (
          <NavbarSearchInput placeholder="جستجو در مطالب،کاربران،ابزارها و ..." />
        ) : (
          <PopupMenu
            menuStyle={{
              padding: 0,
              border: 0,
              backgroundColor: 'transparent',
              paddingTop: '0.2rem',
            }}
            trigger="click">
            <div>
              <SearchIcon
                size={30}
                color="#fff"
                style={{ margin: '0.5rem 1.5rem 0 1.5rem', cursor: 'pointer' }}
              />
            </div>
            <NavbarSearchInput
              style={{ direction: RV_Direction, boxShadow: '0 0 0.3rem #333' }}
              autoFocus
              placeholder="جستجو در مطالب،کاربران،ابزارها و ..."
            />
          </PopupMenu>
        )}
        <PopupMenu trigger="click">
          <div>
            <Avatar />
          </div>
          <AvatarMenuList />
        </PopupMenu>
      </Styled.SearchWrapper>
    </Styled.NavbarContainer>
  );
};

export default memo(Navbar);

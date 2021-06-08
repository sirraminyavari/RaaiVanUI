/**
 * Renders whole navbar area for app.
 */
import { lazy, Suspense, memo, useState } from 'react';
import { useSelector } from 'react-redux';
import Avatar from 'components/Avatar/Avatar';
import NavbarSearchInput from './items/SearchInput';
import * as Styled from './Navbar.styles';
import { useMediaQuery } from 'react-responsive';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import AvatarMenuList from './items/AvatarMenu/AvatarMenuList';
import { createSelector } from 'reselect';
import {
  WIDE_BOUNDRY,
  MEDIUM_BOUNDRY,
  MOBILE_BOUNDRY,
} from 'constant/constants';
import { BG_WHITE, C_WHITE } from 'constant/Colors';
import useWindow from 'hooks/useWindowContext';

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

const Navbar = () => {
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const [showSearch, setShowSearch] = useState(false);
  const { RVGlobal } = useWindow();

  const userImage = RVGlobal.CurrentUser.ProfileImageURL;

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

  const showMobileNav = () => {
    if (!isSidebarOpen && isMobileScreen) return true;
    if (isSidebarOpen && isMobileNav) return true;
    return showSearch;
  };

  const handleShowSearch = () => {
    setShowSearch(true);
  };

  const handleHideSearch = () => {
    setShowSearch(false);
  };

  return (
    <Styled.NavbarContainer isMobile={isMobileScreen}>
      <Suspense fallback={<Styled.NavMenuContainer />}>
        {showMobileNav() ? <MobileMenu /> : <WideScreenMenu />}
      </Suspense>
      <Styled.SearchWrapper>
        {showInput() ? (
          <NavbarSearchInput
            onBlur={handleHideSearch}
            autoFocus={showSearch}
            placeholder="جستجو در مطالب،کاربران،ابزارها و ..."
          />
        ) : (
          <SearchIcon
            size={30}
            className={C_WHITE}
            style={{ margin: '0.5rem 1.5rem 0 1.5rem', cursor: 'pointer' }}
            onClick={handleShowSearch}
          />
        )}
        <PopupMenu
          arrowClass="no-arrow"
          menuClass={BG_WHITE}
          menuStyle={`
            border: 0;
            margin: 0.5rem 0.15rem;
            box-shadow: 1px 3px 20px #2B7BE44D;
            border-radius: 0.6rem;
          `}
          trigger="click">
          <div>
            <Avatar userImage={userImage} style={{ cursor: 'pointer' }} />
          </div>
          <AvatarMenuList />
        </PopupMenu>
      </Styled.SearchWrapper>
    </Styled.NavbarContainer>
  );
};

export default memo(Navbar);

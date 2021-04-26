/**
 * Renders whole navbar area for app.
 */
import { lazy, Suspense, memo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from 'components/Avatar/Avatar';
import NavbarSearchInput from './items/NavSearchInput';
import * as Styled from './Navbar.styles';
import { useMediaQuery } from 'react-responsive';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import AvatarMenuList from './items/AvatarMenu/AvatarMenuList';
import { createSelector } from 'reselect';
import { themeSlice } from 'store/reducers/themeReducer';
import {
  WIDE_BOUNDRY,
  MEDIUM_BOUNDRY,
  MOBILE_BOUNDRY,
} from 'constant/constants';
import { BG_WARM } from 'constant/Colors';

const NavWideScreenMenu = lazy(() =>
  import(
    /* webpackChunkName: "nav-wide-screen-menu-component"*/ './items/NavWideScreenMenu'
  )
);
const NavMobileMenu = lazy(() =>
  import(
    /* webpackChunkName: "nav-mobile-menu-component"*/ './items/NavMobileMenu'
  )
);

const { setActivePath } = themeSlice.actions;

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  //!
  const isSidebarOpen = useSelector(selectIsSidebarOpen);

  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    dispatch(setActivePath(location.pathname));
  }, [location, dispatch]);

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
    <Styled.NavbarContainer className={BG_WARM} isMobile={isMobileScreen}>
      <Suspense fallback={<Styled.NavMenuContainer />}>
        {showMobileNav() ? <NavMobileMenu /> : <NavWideScreenMenu />}
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
            color="#fff"
            style={{ margin: '0.5rem 1.5rem 0 1.5rem', cursor: 'pointer' }}
            onClick={handleShowSearch}
          />
        )}
        <PopupMenu
          arrowClass="no-arrow"
          menuStyle={`
            border: 0;
            margin: 0.5rem 0.15rem;
            background-color: #fff;
            box-shadow: 0 0 0.3rem #333;
          `}
          trigger="click">
          <div>
            <Avatar style={{ cursor: 'pointer' }} />
          </div>
          <AvatarMenuList />
        </PopupMenu>
      </Styled.SearchWrapper>
    </Styled.NavbarContainer>
  );
};

export default memo(Navbar);

import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import Avatar from 'components/Avatar/Avatar';
import NavbarSearchInput from './components/NavSearchInput';
import * as Styled from './Navbar.styles';
import { useMediaQuery } from 'react-responsive';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import AutoSuggestInput from 'components/Inputs/AutoSuggestInput/AutoSuggestInput';
import {
  WIDE_BOUNDRY,
  MEDIUM_BOUNDRY,
  MOBILE_BOUNDRY,
} from 'constant/constants';
import { BG_WARM } from 'constant/Colors';
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

const Navbar = () => {
  const { isSidebarOpen } = useSelector((state) => state.theme);
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
    <Styled.NavbarContainer
      className={BG_WARM}
      isSidebarOpen={isSidebarOpen}
      isMobile={isMobileScreen}>
      <Suspense fallback={<Styled.NavMenuContainer />}>
        {showMobileNav() ? <NavMobileMenu /> : <NavWideScreenMenu />}
      </Suspense>
      <Styled.SearchWrapper>
        {showInput() ? (
          <AutoSuggestInput
            style={{ margin: '0 1.5rem' }}
            endpoint="names"
            onSearchChange={(value) => console.log(value)}
            placeholder={'جستجو در مطالب،کاربران،ابزارها و ...'}>
            <NavbarSearchInput />
          </AutoSuggestInput>
        ) : (
          <SearchIcon size={30} color="#fff" style={{ margin: '0 1.5rem' }} />
        )}
        <Avatar />
      </Styled.SearchWrapper>
    </Styled.NavbarContainer>
  );
};

export default Navbar;

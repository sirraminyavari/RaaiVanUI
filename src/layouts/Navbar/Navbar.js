import { lazy, Suspense } from 'react';
import Avatar from 'components/Avatar/Avatar';
import NavbarSearchInput from './components/NavSearchInput';
import * as Styled from './Navbar.styles';
import { useMediaQuery } from 'react-responsive';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import HamburgerMenuIcon from 'components/Icons/MenuIcon/HamburgerMenuIcon';
import {
  WIDE_BOUNDRY,
  MEDIUM_BOUNDRY,
  MOBILE_BOUNDRY,
} from 'constant/constants';
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

const Navbar = ({ isSidebarOpen }) => {
  const isWideScreen = useMediaQuery({ query: `(min-width: ${WIDE_BOUNDRY})` });
  const isMediumScreen = useMediaQuery({
    query: `(min-width: ${MEDIUM_BOUNDRY})`,
  });
  const isMobileScreen = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  });

  return (
    <Styled.NavbarContainer
      isSidebarOpen={isSidebarOpen}
      isMobile={isMobileScreen}>
      <Suspense
        fallback={
          <Styled.NavMenuContainer>
            <HamburgerMenuIcon size={30} color="#fff" />
          </Styled.NavMenuContainer>
        }>
        {isMobileScreen ? <NavMobileMenu /> : <NavWideScreenMenu />}
      </Suspense>
      <Styled.SearchWrapper>
        {isSidebarOpen ? (
          isMediumScreen ? (
            <NavbarSearchInput />
          ) : (
            <SearchIcon size={30} color="#fff" />
          )
        ) : isWideScreen ? (
          <NavbarSearchInput />
        ) : (
          <SearchIcon size={30} color="#fff" />
        )}
        <Avatar radius={32} />
      </Styled.SearchWrapper>
    </Styled.NavbarContainer>
  );
};

export default Navbar;

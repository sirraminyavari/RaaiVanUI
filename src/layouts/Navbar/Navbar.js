import { lazy, Suspense } from 'react';
import Avatar from 'components/Avatar/Avatar';
import NavbarSearchInput from './components/NavSearchInput';
import * as Styled from './Navbar.styles';
import { useMediaQuery } from 'react-responsive';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import HamburgerMenuIcon from 'components/Icons/MenuIcon/HamburgerMenuIcon';
import PopupMenu from 'components/PopupMenu/PopupMenu';
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
            <SearchIcon size={30} color="#fff" style={{ margin: '0 1.5rem' }} />
          )
        ) : isWideScreen ? (
          <NavbarSearchInput />
        ) : (
          <SearchIcon size={30} color="#fff" style={{ margin: '0 1.5rem' }} />
        )}
        <PopupMenu
          content={"Hello, I'm a Tooltip"}
          delay={1000}
          menuStyle="color: #fff; background-color: #333; border: none; ">
          <Avatar radius={32} />
        </PopupMenu>
      </Styled.SearchWrapper>
    </Styled.NavbarContainer>
  );
};

export default Navbar;

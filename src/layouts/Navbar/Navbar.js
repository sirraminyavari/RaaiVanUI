import { lazy, Suspense } from 'react';
import Avatar from 'components/Avatar';
import NavbarSearchInput from './components/SearchInput';
import * as Styled from './Navbar.styles';
import { useMediaQuery } from 'react-responsive';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import MenuIcon from 'components/Icons/MenuIcon/Menu';
import {
  WIDE_BOUNDRY,
  MEDIUM_BOUNDRY,
  MOBILE_BOUNDRY,
} from 'constant/constants';
const NavButtons = lazy(() => import('./components/NavButtons'));
const NavMenus = lazy(() => import('./components/NavMenus'));

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
            <MenuIcon size={30} color="#fff" />
          </Styled.NavMenuContainer>
        }>
        {isMobileScreen ? <NavMenus /> : <NavButtons />}
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

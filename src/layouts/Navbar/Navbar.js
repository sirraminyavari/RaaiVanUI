import Avatar from 'components/Avatar';
import NavbarButton from './components/NavbarButton';
import NavbarSearchInput from './components/NavbarSearchInput';
import * as Styled from './Navbar.styles';
import { useMediaQuery } from 'react-responsive';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import MenuIcon from 'components/Icons/MenuIcon/Menu';
import NavbarIcons from 'components/Icons/NavbarIcons/NavbarIcons';
import {
  WIDE_BOUNDRY,
  MEDIUM_BOUNDRY,
  MOBILE_BOUNDRY,
} from 'constant/constants';

const navButtons = [
  { id: 1, title: 'خانه', icon: 'home', linkTo: '/home' },
  {
    id: 2,
    title: 'پیمایش',
    icon: 'direction',
    options: [
      { id: 1, title: 'مرورگر', icon: 'site' },
      { id: 2, title: 'نقشه گرافیکی', icon: 'target' },
    ],
  },
  {
    id: 3,
    title: 'پرسش',
    icon: 'question',
    options: [
      { id: 1, title: 'پرسش جدید', icon: 'plus' },
      { id: 2, title: 'پرسش ها', icon: 'question' },
    ],
  },
  { id: 4, title: 'همکاران', icon: 'teams', linkTo: '/teams' },
  { id: 5, title: 'پیام ها', icon: 'messages', linkTo: '/messages' },
  { id: 6, title: 'کارتابل', icon: 'dashboard', linkTo: '/dashboard' },
  {
    id: 7,
    title: 'اعلان ها',
    icon: 'notifications',
    linkTo: '/notifications',
    badge: 99,
  },
];

const Navbar = ({ isSidebarOpen }) => {
  const isWideScreen = useMediaQuery({ query: `(min-width: ${WIDE_BOUNDRY})` });
  const isMediumScreen = useMediaQuery({
    query: `(min-width: ${MEDIUM_BOUNDRY})`,
  });
  const isMobileOrTabletScreen = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  });

  const flattenedNavButtons = navButtons.reduce(
    (acc, val) => acc.concat(val.options ? val.options : val),
    []
  );

  return (
    <Styled.NavbarContainer
      isSidebarOpen={isSidebarOpen}
      isMobile={isMobileOrTabletScreen}>
      {!isMobileOrTabletScreen ? (
        <Styled.ButtonsWrapper>
          {navButtons.map((btn) => {
            return <NavbarButton btnProps={btn} key={btn.id} />;
          })}
        </Styled.ButtonsWrapper>
      ) : (
        <Styled.NavMenuContainer>
          <MenuIcon size={30} color="#fff" />
          <Styled.MenuOptionsWrapper>
            {flattenedNavButtons.map((btn, index) => {
              return (
                <div
                  key={index}
                  style={{
                    width: '33.333%',
                    height: '33%',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {NavbarIcons[btn.icon]({ color: '#2B388F', size: 20 })}
                  {btn.title}
                </div>
              );
            })}
          </Styled.MenuOptionsWrapper>
        </Styled.NavMenuContainer>
      )}
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

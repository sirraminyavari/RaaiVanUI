import Avatar from 'components/Avatar';
import NavbarButton from './NavbarButton';
import NavbarSearchInput from './NavbarSearchInput';
import * as Styled from './Navbar.styles';

const navButtons = [
  { label: 'خانه', icon: 'home', linkTo: '/home' },
  { label: 'تیم ها', icon: 'teams', linkTo: '/teams' },
  { label: 'کارتابل', icon: 'dashboard', linkTo: '/dashboard' },
  {
    label: 'اعلان ها',
    icon: 'notifications',
    linkTo: '/notifications',
    badge: 99,
  },
];

const Navbar = ({ isSidebarOpen }) => {
  return (
    <Styled.NavbarContainer isSidebarOpen={isSidebarOpen}>
      <Styled.ButtonsWrapper>
        {navButtons.map((btn, key) => {
          return <NavbarButton options={btn} key={key} />;
        })}
      </Styled.ButtonsWrapper>
      <Styled.SearchWrapper>
        <NavbarSearchInput />
        <Avatar radius={32} />
      </Styled.SearchWrapper>
    </Styled.NavbarContainer>
  );
};

export default Navbar;

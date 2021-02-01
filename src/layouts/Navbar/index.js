import Avatar from 'components/Avatar';
import NavbarButton from './NavbarButton';
import NavbarSearchInput from './NavbarSearchInput';
import { useContext } from 'react';
import { ThemeContext } from 'context/ThemeProvider';
import {
  NavbarContainer,
  ButtonsWrapper,
  SearchWrapper,
} from './Navbar.styles';

const navButtons = [
  { label: 'خانه', icon: 'home', linkTo: '/home' },
  { label: 'تیم ها', icon: 'teams', linkTo: '/teams' },
  { label: 'کارتابل', icon: 'inbox', linkTo: '/inbox' },
  {
    label: 'اعلان ها',
    icon: 'notifications',
    linkTo: '/notifications',
    badge: 99,
  },
];

const Navbar = () => {
  const { isOpen } = useContext(ThemeContext);
  return (
    <NavbarContainer isOpen={isOpen}>
      <ButtonsWrapper>
        {navButtons.map((btn) => {
          return <NavbarButton options={btn} />;
        })}
      </ButtonsWrapper>
      <SearchWrapper>
        <NavbarSearchInput />
        <Avatar radius={32} />
      </SearchWrapper>
    </NavbarContainer>
  );
};

export default Navbar;

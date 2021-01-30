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

const Navbar = () => {
  const { isOpen } = useContext(ThemeContext);
  return (
    <NavbarContainer isOpen={isOpen}>
      <ButtonsWrapper>
        <NavbarButton linkTo="/home" label="خانه" icon="home" />
        <NavbarButton linkTo="/teams" label="تیم ها" icon="users" />
        <NavbarButton linkTo="/messages" label="پیام ها" icon="commenting-o" />
        <NavbarButton linkTo="/inbox" label="کارتابل" icon="inbox" />
        <NavbarButton
          linkTo="/notifications"
          label="اعلان ها"
          icon="bell"
          badge={99}
        />
      </ButtonsWrapper>
      <SearchWrapper>
        <NavbarSearchInput />
        <Avatar radius={32} />
      </SearchWrapper>
    </NavbarContainer>
  );
};

export default Navbar;

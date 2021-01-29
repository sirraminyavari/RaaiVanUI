import Avatar from 'components/Avatar';
import SocialIcon from 'assets/icons/social.svg';
import TeamsIcon from 'assets/icons/teams.svg';
import MessagesIcon from 'assets/icons/messages.svg';
import NotificationsIcon from 'assets/icons/notifications.svg';
import NavbarButton from './NavbarButton';
import NavbarSearchInput from './NavbarSearchInput';
import {
  NavbarContainer,
  ButtonsWrapper,
  SearchWrapper,
} from 'assets/jss/Navbar.styles';

const Navbar = () => {
  return (
    <NavbarContainer>
      <ButtonsWrapper>
        <NavbarButton label="اجتماعی" icon={SocialIcon} />
        <NavbarButton label="تیم ها" icon={TeamsIcon} />
        <NavbarButton label="پیام ها" icon={MessagesIcon} />
        <NavbarButton label="اعلان ها" icon={NotificationsIcon} badge={99} />
      </ButtonsWrapper>
      <SearchWrapper>
        <NavbarSearchInput />
        <Avatar radius={32} />
      </SearchWrapper>
    </NavbarContainer>
  );
};

export default Navbar;

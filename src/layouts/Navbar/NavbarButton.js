import { Link } from 'react-router-dom';
import { ButtonContainer, BadgeWrapper, ButtonIcon } from './Navbar.styles';

const NavbarButton = ({ label, icon, badge, linkTo }) => {
  return (
    <ButtonContainer as={Link} to={linkTo}>
      <ButtonIcon>
        <i className={`fa fa-${icon}`} aria-hidden="true" />
        {badge && <BadgeWrapper>{badge}</BadgeWrapper>}
      </ButtonIcon>
      <span>{label}</span>
    </ButtonContainer>
  );
};

export default NavbarButton;

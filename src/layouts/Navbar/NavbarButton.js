import { Link } from 'react-router-dom';
import * as Styled from './Navbar.styles';
import NavbarIcons from 'components/Icons/NavbarIcons/NavbarIcons';

const NavbarButton = ({ options }) => {
  const { label, icon, badge, linkTo } = options;
  return (
    <Styled.ButtonContainer as={Link} to={linkTo}>
      <Styled.ButtonIcon>
        {NavbarIcons[icon]()}
        {badge && <Styled.BadgeWrapper>{badge}</Styled.BadgeWrapper>}
      </Styled.ButtonIcon>
      <span>{label}</span>
    </Styled.ButtonContainer>
  );
};

export default NavbarButton;

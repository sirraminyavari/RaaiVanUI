import { Link } from 'react-router-dom';
import { ButtonContainer, BadgeWrapper, ButtonIcon } from './Navbar.styles';
import Icons from 'components/Icons';

const NavbarButton = ({ options }) => {
  const { label, icon, badge, linkTo } = options;
  return (
    <ButtonContainer as={Link} to={linkTo}>
      <ButtonIcon>
        {Icons[icon]}
        {badge && <BadgeWrapper>{badge}</BadgeWrapper>}
      </ButtonIcon>
      <span>{label}</span>
    </ButtonContainer>
  );
};

export default NavbarButton;

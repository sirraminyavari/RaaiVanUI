import { Link } from 'react-router-dom';
import * as Styled from './Navbar.styles';
import Icons from 'components/Icons';

const NavbarButton = ({ options }) => {
  const { label, icon, badge, linkTo } = options;
  return (
    <Styled.ButtonContainer as={Link} to={linkTo}>
      <Styled.ButtonIcon>
        {Icons[icon]}
        {badge && <Styled.BadgeWrapper>{badge}</Styled.BadgeWrapper>}
      </Styled.ButtonIcon>
      <span>{label}</span>
    </Styled.ButtonContainer>
  );
};

export default NavbarButton;

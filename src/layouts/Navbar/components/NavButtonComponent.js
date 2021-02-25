import { Link } from 'react-router-dom';
import * as Styled from '../Navbar.styles';
import NavbarIcons from 'components/Icons/NavbarIcons/NavbarIcons';
import { getLanguageDigits } from 'helpers/helpers';

const NavButtonComponent = ({ btnProps, badge }) => {
  const { title, icon, linkTo, actions } = btnProps;

  return (
    <Styled.ButtonContainer as={linkTo ? Link : 'div'} to={linkTo}>
      <Styled.ButtonIcon>
        {NavbarIcons[icon]()}
        {badge && <Styled.Badge>{getLanguageDigits('fa', badge)}</Styled.Badge>}
      </Styled.ButtonIcon>
      <Styled.ButtonTitle>
        {title}
        {actions && <Styled.Arrow />}
      </Styled.ButtonTitle>
    </Styled.ButtonContainer>
  );
};

export default NavButtonComponent;

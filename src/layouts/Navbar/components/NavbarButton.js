import { lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Styled from '../Navbar.styles';
import NavbarIcons from 'components/Icons/NavbarIcons/NavbarIcons';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
const BottonOptions = lazy(() => import('./ButtonOptions'));

const NavbarButton = ({ btnProps }) => {
  const { title, icon, badge, linkTo, options } = btnProps;
  const [isOptionShown, setIsOptionShown] = useState(false);
  const handleOptions = () => {
    setIsOptionShown(!isOptionShown);
  };
  return (
    <Styled.ButtonContainer
      as={linkTo ? Link : 'div'}
      to={linkTo}
      onMouseEnter={handleOptions}
      onMouseLeave={handleOptions}>
      <Styled.ButtonIcon>
        {NavbarIcons[icon]()}
        {badge && <Styled.BadgeWrapper>{badge}</Styled.BadgeWrapper>}
      </Styled.ButtonIcon>
      <Styled.ButtonTitle>
        {title}
        {options && <CaretIcon dir={isOptionShown ? 'up' : 'down'} size={12} />}
      </Styled.ButtonTitle>
      {options && (
        <BottonOptions isOptionShown={isOptionShown} options={options} />
      )}
    </Styled.ButtonContainer>
  );
};

export default NavbarButton;

import { lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Styled from '../Navbar.styles';
import NavbarIcons from 'components/Icons/NavbarIcons/NavbarIcons';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
const ButtonActions = lazy(() =>
  import(/* webpackChunkName: "nav-button-actions"*/ './NavButtonActions')
);

const NavButtonComponent = ({ btnProps, badge }) => {
  const { title, icon, linkTo, options } = btnProps;
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
        {badge && <Styled.Badge>{badge}</Styled.Badge>}
      </Styled.ButtonIcon>
      <Styled.ButtonTitle>
        {title}
        {options && <CaretIcon dir={isOptionShown ? 'up' : 'down'} size={12} />}
      </Styled.ButtonTitle>
      {options && (
        <ButtonActions isOptionShown={isOptionShown} options={options} />
      )}
    </Styled.ButtonContainer>
  );
};

export default NavButtonComponent;

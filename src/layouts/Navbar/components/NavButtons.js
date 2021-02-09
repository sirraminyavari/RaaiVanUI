import * as Styled from '../Navbar.styles';
import NavbarButton from './Button';
import NavButtonsList from './NavButtonsList';

const NavButtons = () => {
  return (
    <Styled.ButtonsWrapper>
      {NavButtonsList.map((btn) => {
        return <NavbarButton btnProps={btn} badge={btn.badge} key={btn.id} />;
      })}
    </Styled.ButtonsWrapper>
  );
};

export default NavButtons;

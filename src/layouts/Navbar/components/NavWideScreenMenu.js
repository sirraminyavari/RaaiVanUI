import * as Styled from '../Navbar.styles';
import NavButtonComponent from './NavButtonComponent';
import NavButtonsList from './buttonsList';

const NavWideScreenMenu = () => {
  return (
    <Styled.WideScreenMenu>
      {NavButtonsList.map((btn) => {
        return (
          <NavButtonComponent btnProps={btn} badge={btn.badge} key={btn.id} />
        );
      })}
    </Styled.WideScreenMenu>
  );
};

export default NavWideScreenMenu;

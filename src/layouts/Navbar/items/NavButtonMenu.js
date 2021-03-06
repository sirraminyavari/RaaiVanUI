/**
 * A component for showing navbar buttons sub menu.
 */
import { Link } from 'react-router-dom';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import NavbarIcons from './NavbarIcons/NavbarIcons';
import { TC_DEFAULT } from 'constant/Colors';

/**
 * @typedef PropType
 * @property {Array} actions
 */

/**
 * @description A component that renders a menu for navbar buttons.
 * @param {PropType} props
 */
const NavButtonMenu = (props) => {
  const { actions } = props;

  return (
    <Styled.FixActionsContainer>
      {actions?.map((action) => {
        return (
          <Styled.ButtonAction
            as={Link}
            to={action?.linkTo}
            key={action?.index}>
            {NavbarIcons[action?.icon]({ className: TC_DEFAULT, size: 20 })}
            <Styled.ActionTitle>{action?.title}</Styled.ActionTitle>
          </Styled.ButtonAction>
        );
      })}
    </Styled.FixActionsContainer>
  );
};

export default NavButtonMenu;

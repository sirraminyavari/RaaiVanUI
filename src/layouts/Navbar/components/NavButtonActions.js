/**
 * A component for showing navbar buttons sub menu.
 */
import { Link } from 'react-router-dom';
import * as Styled from '../Navbar.styles';
import NavbarIcons from 'components/Icons/NavbarIcons/NavbarIcons';

/**
 * @typedef PropType
 * @property {Array} actions
 */

/**
 * @description A component that renders a menu for navbar buttons.
 * @param {PropType} props
 */
const NavButtonActions = (props) => {
  const { actions } = props;

  return (
    <Styled.ButtonActionsContainer optionCount={actions.length}>
      {actions.map((action) => {
        return (
          <Styled.ButtonAction as={Link} to={action.linkTo} key={action.id}>
            {NavbarIcons[action.icon]({ color: '#2B7BE4', size: 20 })}
            <Styled.ActionTitle>{action.title}</Styled.ActionTitle>
          </Styled.ButtonAction>
        );
      })}
    </Styled.ButtonActionsContainer>
  );
};

export default NavButtonActions;

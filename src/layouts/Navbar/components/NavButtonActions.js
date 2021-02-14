import { Link } from 'react-router-dom';
import * as Styled from '../Navbar.styles';
import NavbarIcons from 'components/Icons/NavbarIcons/NavbarIcons';

const NavButtonActions = ({ actions }) => {
  return (
    <Styled.ButtonActionsContainer optionCount={actions.length}>
      {actions.map((action) => {
        return (
          <Styled.ButtonAction as={Link} to="/home" key={action.id}>
            {NavbarIcons[action.icon]({ color: '#2B7BE4', size: 20 })}
            <span style={{ margin: '5px 10px' }}>{action.title}</span>
          </Styled.ButtonAction>
        );
      })}
    </Styled.ButtonActionsContainer>
  );
};

export default NavButtonActions;

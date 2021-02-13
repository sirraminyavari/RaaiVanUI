import { Link } from 'react-router-dom';
import * as Styled from '../Navbar.styles';
import NavbarIcons from 'components/Icons/NavbarIcons/NavbarIcons';

const NavButtonActions = ({ actions }) => {
  return (
    <Styled.ButtonActionsContainer optionCount={actions.length}>
      {actions.map((option) => {
        return (
          <Styled.ButtonAction as={Link} to="#" key={option.id}>
            {NavbarIcons[option.icon]({ color: '#2B7BE4', size: 20 })}
            <span style={{ margin: '5px 10px' }}>{option.title}</span>
          </Styled.ButtonAction>
        );
      })}
    </Styled.ButtonActionsContainer>
  );
};

export default NavButtonActions;

import { Link } from 'react-router-dom';
import * as Styled from '../Navbar.styles';
import NavbarIcons from 'components/Icons/NavbarIcons/NavbarIcons';

const BottonOptions = ({ isOptionShown, options }) => {
  return (
    <Styled.OptionsContainer
      isOptionShown={isOptionShown}
      optionCount={options.length}>
      {options.map((option) => {
        return (
          <Styled.BtnOptionWrapper as={Link} to="#" key={option.id}>
            {NavbarIcons[option.icon]({ color: '#2B7BE4', size: 20 })}
            <span style={{ margin: '5px 10px' }}>{option.title}</span>
          </Styled.BtnOptionWrapper>
        );
      })}
    </Styled.OptionsContainer>
  );
};

export default BottonOptions;

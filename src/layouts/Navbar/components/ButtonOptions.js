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
          <Styled.OptionWrapper as={Link} to="#">
            {NavbarIcons[option.optIcon]({ color: '#2B7BE4', size: 20 })}
            <span style={{ margin: '5px 10px' }}>{option.optName}</span>
          </Styled.OptionWrapper>
        );
      })}
    </Styled.OptionsContainer>
  );
};

export default BottonOptions;

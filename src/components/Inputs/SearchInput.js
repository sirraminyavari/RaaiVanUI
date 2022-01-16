import styled from 'styled-components';
import { FLEX_RCB } from 'constant/StyledCommonCss';
import { CV_DISTANT, CV_WHITE } from 'constant/CssVariables';
import RxInput from './RxInput';
import SearchIcon from '../Icons/SearchIcon/Search';

const SearchInput = (props) => {
  return (
    <InputContainer>
      <Input {...props} />
      <SearchIcon size={30} />
    </InputContainer>
  );
};
const InputContainer = styled.div`
  ${FLEX_RCB};
  background-color: ${CV_WHITE};
  color: ${CV_DISTANT};
  height: 3rem;
  border-radius: 0.625rem;
  border: 0.01rem solid ${CV_DISTANT};
  max-width: 37rem;
  width: 100%;
  margin: 2.5rem 0 3rem 0;
  padding: 0 1rem;
`;

const Input = styled(RxInput)`
  width: 100%;
  outline: none;
  border: none;
  color: ${CV_DISTANT};
`;
export default SearchInput;

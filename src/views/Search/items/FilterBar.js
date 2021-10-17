import * as Styled from '../SearchStyle';
import { useContext } from 'react';
import { WindowContext } from '../../../context/WindowProvider';
import Input from '../../../components/Inputs/Input';
const FilterBar = () => {
  const { RV_RTL } = useContext(WindowContext);
  return (
    <Styled.FilterBarWrapper rtl={RV_RTL}>
      <Input placeholder={'...'}></Input>
    </Styled.FilterBarWrapper>
  );
};
export default FilterBar;

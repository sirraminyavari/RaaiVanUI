import * as Styled from '../SearchStyle';
import { useContext } from 'react';
import { WindowContext } from '../../../context/WindowProvider';
import Input from '../../../components/Inputs/Input';
import Button from '../../../components/Buttons/Button';
import { SearchContext } from '../SearchProvider';

/**
 * A component to represent filter on top of the search result
 * @return {JSX.Element}
 * @constructor
 */
const FilterBar = () => {
  const { RV_RTL } = useContext(WindowContext);
  const { toggleAdvancedFilter } = useContext(SearchContext);
  return (
    <Styled.FilterBarWrapper rtl={RV_RTL}>
      <Input placeholder={'...'}></Input>

      <Button onClick={(e) => toggleAdvancedFilter()}>پیشرفته</Button>
    </Styled.FilterBarWrapper>
  );
};
export default FilterBar;

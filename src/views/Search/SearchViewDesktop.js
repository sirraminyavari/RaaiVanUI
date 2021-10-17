import * as Styled from './SearchStyle';
import { useContext } from 'react';
import { SearchContext } from './SearchProvider';
import Heading from '../../components/Heading/Heading';
import AdvancedFilter from './items/AdvancedFilter';
import { WindowContext } from '../../context/WindowProvider';
import FilterBar from './items/FilterBar';

/**
 * Search result representation for desktop device use case
 * @return {JSX.Element}
 * @constructor
 */
const SearchViewDesktop = () => {
  const { advancedFilterOpen } = useContext(SearchContext);
  const { RV_RTL } = useContext(WindowContext);
  return (
    <Styled.Container rtl={RV_RTL} className={'rv-bg-color-white'}>
      <Styled.SearchDesktopMain advancedFilterOpen={advancedFilterOpen}>
        <Heading>نتایج جستجو برای سپهر</Heading>

        <FilterBar />
      </Styled.SearchDesktopMain>

      <AdvancedFilter />
    </Styled.Container>
  );
};
export default SearchViewDesktop;

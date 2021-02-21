import * as Styled from '../Sidebar.styles';
import FilterIcon from 'components/Icons/FilterIcon/Filter';
import SidebarMenuTrees from './MenuTrees';
import UnderMenuList from './UnderMenuList';
import AutoSuggestInput from 'components/Inputs/AutoSuggestInput/AutoSuggestInput';

const SidebarMain = () => {
  return (
    <>
      <Styled.SearchWrapper>
        <AutoSuggestInput
          getSuggestedItems={(items) => console.log(items)}
          withMenu={false}>
          <Styled.SearchInput text="جستجو در کلاس  و دسته" />
        </AutoSuggestInput>
        <FilterIcon />
      </Styled.SearchWrapper>
      <SidebarMenuTrees />
      <hr />
      <UnderMenuList />
    </>
  );
};

export default SidebarMain;

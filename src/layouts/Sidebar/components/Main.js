import * as Styled from '../Sidebar.styles';
import FilterIcon from 'components/Icons/FilterIcon/Filter';
import SidebarMenuTrees from './MenuTrees';
import UnderMenuList from './UnderMenuList';

const SidebarMain = () => {
  return (
    <>
      <Styled.SearchWrapper>
        <Styled.SearchInput text="جستجو در کلاس  و دسته" />
        <FilterIcon />
      </Styled.SearchWrapper>
      <SidebarMenuTrees />
      <hr />
      <UnderMenuList />
    </>
  );
};

export default SidebarMain;

import { useSelector, useDispatch } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import FilterIcon from 'components/Icons/FilterIcon/Filter';
import * as Styled from '../Sidebar.styles';

const SearchBox = () => {
  const dispatch = useDispatch();
  const { setSearchText } = sidebarMenuSlice.actions;
  const searchText = useSelector((state) => state.sidebarItems.searchText);

  const handleChange = (e) => {
    dispatch(setSearchText(e.target.value));
  };

  return (
    <Styled.SearchWrapper>
      <Styled.SearchInput
        text="جستجو در کلاس  و دسته"
        onChange={handleChange}
        value={searchText}
      />
      <Styled.FilterIconWrapper>
        <FilterIcon />
      </Styled.FilterIconWrapper>
    </Styled.SearchWrapper>
  );
};

export default SearchBox;

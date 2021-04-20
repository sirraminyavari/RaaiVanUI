/**
 * Renders a decent search area for sidebar.
 */
import { useSelector, useDispatch } from 'react-redux';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import FilterIcon from 'components/Icons/FilterIcon/Filter';
import CancelIcon from 'components/Icons/CloseIcon/CloseIcon';
import * as Styled from '../Sidebar.styles';

const SearchBox = () => {
  const dispatch = useDispatch();
  const { setSearchText } = sidebarMenuSlice.actions;
  const searchText = useSelector((state) => state.sidebarItems.searchText);

  //! Calls on every change that happens at input value
  //! ...and updates redux state.
  const handleChange = (e) => {
    dispatch(setSearchText(e.target.value));
  };

  //! Clears search text when user clicks on cancel icon.
  const handleClearSearchText = (e) => {
    dispatch(setSearchText(''));
  };

  //! Check if user in typing or not.
  const isTyping = !!searchText.length;

  return (
    <Styled.SearchWrapper>
      <Styled.CancelIconWrapper
        isTyping={isTyping}
        onClick={handleClearSearchText}>
        <CancelIcon />
      </Styled.CancelIconWrapper>
      <Styled.SearchInput
        text="جستجو در کلاس  و دسته"
        onChange={handleChange}
        value={searchText}
        isTyping={isTyping}
      />
      <Styled.FilterIconWrapper>
        <FilterIcon />
      </Styled.FilterIconWrapper>
    </Styled.SearchWrapper>
  );
};

export default SearchBox;

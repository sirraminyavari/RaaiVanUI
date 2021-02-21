import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import FilterIcon from 'components/Icons/FilterIcon/Filter';
import AutoSuggestInput from 'components/Inputs/AutoSuggestInput/AutoSuggestInput';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import * as Styled from '../Sidebar.styles';

const SearchBox = ({ searchAt }) => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { setSearchResults } = sidebarMenuSlice.actions;

  const handleInput = () => {
    if (
      inputRef.current.value === '' ||
      !(inputRef.current.value.length > searchAt)
    ) {
      dispatch(setSearchResults([]));
    }
  };

  const handleSuggestions = (items) => {
    dispatch(setSearchResults(items));
  };

  return (
    <Styled.SearchWrapper>
      <AutoSuggestInput
        searchAt={searchAt}
        getSuggestedItems={handleSuggestions}
        withMenu={false}>
        <Styled.SearchInput
          text="جستجو در کلاس  و دسته"
          onInput={handleInput}
          ref={inputRef}
        />
      </AutoSuggestInput>
      <div style={{ position: 'absolute', left: '0.3rem', bottom: '0' }}>
        <FilterIcon />
      </div>
    </Styled.SearchWrapper>
  );
};

export default SearchBox;

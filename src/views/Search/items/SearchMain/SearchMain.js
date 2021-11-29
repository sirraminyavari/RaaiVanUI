import { useContext } from 'react';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import SearchList from './SearchList';
import SearchActions from './SearchActions';

const SearchMain = () => {
  const { searchText, setIsAsideOpen } = useContext(searchContext);

  return (
    <Styled.SearchViewMain>
      <SearchActions />
      <SearchList />
    </Styled.SearchViewMain>
  );
};

export default SearchMain;

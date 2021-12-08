import { useContext } from 'react';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import SearchList from './SearchList';
import SearchActions from './SearchActions';

const SearchMain = () => {
  const { isAsideOpen } = useContext(searchContext);

  return (
    <Styled.SearchViewMain isAsideOpen={isAsideOpen}>
      <SearchActions />
      <SearchList />
    </Styled.SearchViewMain>
  );
};

export default SearchMain;

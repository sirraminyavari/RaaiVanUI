import { useContext } from 'react';
import SearchNotFound from './SearchNotFound';
import SearchingAnimation from './SearchingAnimation';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import FileSearchItem from './SearchItems/FileItem';

const SearchList = () => {
  const { isSearching } = useContext(searchContext);

  return (
    <Styled.SearchListContainer>
      {[...Array(2).keys()].map((i) => (
        <FileSearchItem key={i} />
      ))}
      {isSearching ? <SearchingAnimation /> : <SearchNotFound />}
    </Styled.SearchListContainer>
  );
};

export default SearchList;

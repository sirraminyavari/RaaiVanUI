import { useContext } from 'react';
import SearchNotFound from './SearchNotFound';
import SearchingAnimation from './SearchingAnimation';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import FileSearchItem from './SearchItems/FileItem';
import QuestionSearchItem from './SearchItems/QuestionItem';
import UserSearchItem from './SearchItems/UserItem';
import NodeSearchItem from './SearchItems/NodeItem';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';

const SearchList = () => {
  const { isSearching, searchText } = useContext(searchContext);

  if (!searchText) {
    return (
      <Styled.SearchListContainer>
        <SearchNotFound />
      </Styled.SearchListContainer>
    );
  }

  if (isSearching) {
    return (
      <Styled.SearchListContainer>
        <SearchingAnimation />
      </Styled.SearchListContainer>
    );
  }

  return (
    <Styled.SearchListContainer>
      <PerfectScrollbar>
        <FileSearchItem />
        <QuestionSearchItem />
        <UserSearchItem />
        <NodeSearchItem />
      </PerfectScrollbar>
    </Styled.SearchListContainer>
  );
};

export default SearchList;
